#!/usr/bin/env bash
set -euo pipefail

# ─── Setup Firecracker & Jailer ───────────────────────────────────────────────
#
# Installs Firecracker and Jailer binaries for local development.
#
# Linux : Downloads the latest release, checks KVM, installs to /usr/local/bin.
# macOS : Uses Lima to create a Linux VM, then installs Firecracker inside it.
#
# Usage:
#   bash scripts/setup-firecracker.sh            # interactive
#   bash scripts/setup-firecracker.sh --version v1.14.2  # pin a version
# ──────────────────────────────────────────────────────────────────────────────

FIRECRACKER_VERSION=""
INSTALL_DIR="/usr/local/bin"
LIMA_VM_NAME="firecracker"
LIMA_CPUS=2
LIMA_MEMORY="2GiB"
LIMA_DISK="20GiB"

# ─── Helpers ──────────────────────────────────────────────────────────────────

info()  { printf "\033[1;34m[info]\033[0m  %s\n" "$*"; }
ok()    { printf "\033[1;32m[ok]\033[0m    %s\n" "$*"; }
warn()  { printf "\033[1;33m[warn]\033[0m  %s\n" "$*"; }
err()   { printf "\033[1;31m[error]\033[0m %s\n" "$*" >&2; }
die()   { err "$@"; exit 1; }

require_cmd() {
    command -v "$1" >/dev/null 2>&1 || die "'$1' is required but not found. $2"
}

# ─── Parse arguments ─────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
    case "$1" in
        --version) FIRECRACKER_VERSION="$2"; shift 2 ;;
        --help|-h)
            echo "Usage: setup-firecracker.sh [--version vX.Y.Z]"
            echo ""
            echo "Options:"
            echo "  --version   Pin a specific Firecracker release (e.g. v1.14.2)"
            echo "  --help      Show this help message"
            exit 0
            ;;
        *) die "Unknown option: $1. Use --help for usage." ;;
    esac
done

# ─── Resolve latest version if not pinned ────────────────────────────────────

resolve_version() {
    if [[ -n "$FIRECRACKER_VERSION" ]]; then
        info "Using pinned version: $FIRECRACKER_VERSION"
        return
    fi
    require_cmd curl "Install curl to continue."
    info "Resolving latest Firecracker release..."
    FIRECRACKER_VERSION=$(basename "$(curl -fsSLI -o /dev/null -w '%{url_effective}' \
        https://github.com/firecracker-microvm/firecracker/releases/latest)")
    info "Latest version: $FIRECRACKER_VERSION"
}

# ─── Linux install ───────────────────────────────────────────────────────────

check_kvm() {
    if [[ ! -e /dev/kvm ]]; then
        die "KVM is not available (/dev/kvm not found).
Firecracker requires hardware virtualization (Intel VT-x / AMD-V).
If running in a VM, enable nested virtualization in your hypervisor."
    fi
    if [[ ! -r /dev/kvm ]] || [[ ! -w /dev/kvm ]]; then
        warn "/dev/kvm exists but current user lacks read/write access."
        info "Fix with: sudo chmod 666 /dev/kvm  (or add your user to the kvm group)"
    fi
    ok "KVM is available"
}

install_linux() {
    local arch
    arch="$(uname -m)"

    info "Detected architecture: $arch"

    if [[ "$arch" != "x86_64" && "$arch" != "aarch64" ]]; then
        die "Unsupported architecture: $arch. Firecracker supports x86_64 and aarch64."
    fi

    check_kvm
    resolve_version

    require_cmd curl "Install curl to continue."
    require_cmd tar  "Install tar to continue."

    local release_url="https://github.com/firecracker-microvm/firecracker/releases"
    local tarball="firecracker-${FIRECRACKER_VERSION}-${arch}.tgz"
    local download_url="${release_url}/download/${FIRECRACKER_VERSION}/${tarball}"

    local tmpdir
    tmpdir=$(mktemp -d)
    trap 'rm -rf "$tmpdir"' EXIT

    info "Downloading $tarball..."
    if ! curl -fSL "$download_url" -o "$tmpdir/$tarball"; then
        die "Download failed. Check that version $FIRECRACKER_VERSION exists at:
$download_url"
    fi

    info "Extracting..."
    tar -xzf "$tmpdir/$tarball" -C "$tmpdir"

    local release_dir="$tmpdir/release-${FIRECRACKER_VERSION}-${arch}"
    local fc_bin="$release_dir/firecracker-${FIRECRACKER_VERSION}-${arch}"
    local jailer_bin="$release_dir/jailer-${FIRECRACKER_VERSION}-${arch}"

    if [[ ! -f "$fc_bin" ]]; then
        die "Expected binary not found: $fc_bin"
    fi
    if [[ ! -f "$jailer_bin" ]]; then
        die "Expected binary not found: $jailer_bin"
    fi

    info "Installing binaries to $INSTALL_DIR (may require sudo)..."

    local use_sudo=""
    if [[ ! -w "$INSTALL_DIR" ]]; then
        use_sudo="sudo"
        info "Using sudo to write to $INSTALL_DIR"
    fi

    $use_sudo install -m 0755 "$fc_bin" "$INSTALL_DIR/firecracker"
    $use_sudo install -m 0755 "$jailer_bin" "$INSTALL_DIR/jailer"

    ok "Installed firecracker -> $INSTALL_DIR/firecracker"
    ok "Installed jailer     -> $INSTALL_DIR/jailer"

    # Verify
    echo ""
    info "Verifying installation..."
    firecracker --version
    jailer --version
    echo ""
    ok "Firecracker and Jailer are ready!"
}

# ─── macOS install (via Lima) ────────────────────────────────────────────────

install_macos() {
    info "Firecracker requires Linux with KVM — it cannot run natively on macOS."
    info "We'll set up a Lima Linux VM with KVM support to run Firecracker."
    echo ""

    # Check / install Homebrew
    if ! command -v brew >/dev/null 2>&1; then
        die "Homebrew is required on macOS. Install it from https://brew.sh"
    fi

    # Check / install Lima
    if ! command -v limactl >/dev/null 2>&1; then
        info "Installing Lima via Homebrew..."
        brew install lima
        ok "Lima installed"
    else
        ok "Lima is already installed"
    fi

    # Check if VM already exists
    if limactl list -q 2>/dev/null | grep -q "^${LIMA_VM_NAME}$"; then
        local vm_status
        vm_status=$(limactl list --json 2>/dev/null | grep -o "\"status\":\"[^\"]*\"" | head -1 | cut -d'"' -f4)
        if [[ "$vm_status" == "Running" ]]; then
            ok "Lima VM '$LIMA_VM_NAME' is already running"
        else
            info "Starting existing Lima VM '$LIMA_VM_NAME'..."
            limactl start "$LIMA_VM_NAME"
            ok "Lima VM '$LIMA_VM_NAME' started"
        fi
    else
        info "Creating Lima VM '$LIMA_VM_NAME'..."
        create_lima_vm
        ok "Lima VM '$LIMA_VM_NAME' created and started"
    fi

    # Install Firecracker inside the Lima VM
    resolve_version
    install_firecracker_in_lima

    echo ""
    ok "Setup complete!"
    echo ""
    info "To use Firecracker, shell into the Lima VM:"
    echo ""
    echo "  limactl shell $LIMA_VM_NAME"
    echo ""
    info "Inside the VM, both 'firecracker' and 'jailer' are available."
    info "To stop the VM:  limactl stop $LIMA_VM_NAME"
    info "To delete the VM: limactl delete $LIMA_VM_NAME"
}

create_lima_vm() {
    local lima_config
    lima_config=$(mktemp /tmp/lima-firecracker-XXXXXX.yaml)

    cat > "$lima_config" <<YAML
# Lima VM for Firecracker development
# Requires a CPU with virtualization support (nested virt on Apple Silicon)

images:
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release/ubuntu-24.04-server-cloudimg-amd64.img"
    arch: "x86_64"
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release/ubuntu-24.04-server-cloudimg-arm64.img"
    arch: "aarch64"

cpus: ${LIMA_CPUS}
memory: "${LIMA_MEMORY}"
disk: "${LIMA_DISK}"

# Enable nested virtualization for KVM inside the VM
nestedVirtualization: true

# Mount the current project directory as read-only for convenience
mounts:
  - location: "~"
    writable: false
  - location: "/tmp/lima"
    writable: true

provision:
  - mode: system
    script: |
      #!/bin/bash
      set -eux -o pipefail

      # Install KVM and dependencies
      apt-get update -qq
      apt-get install -y -qq qemu-kvm curl tar iptables iproute2 > /dev/null

      # Ensure KVM device is accessible
      if [ -e /dev/kvm ]; then
          chmod 666 /dev/kvm
      fi
YAML

    limactl create --name="$LIMA_VM_NAME" "$lima_config" --tty=false
    limactl start "$LIMA_VM_NAME"
    rm -f "$lima_config"
}

install_firecracker_in_lima() {
    info "Installing Firecracker $FIRECRACKER_VERSION inside Lima VM..."

    # Detect the architecture inside the VM
    local vm_arch
    vm_arch=$(limactl shell "$LIMA_VM_NAME" uname -m)

    local release_url="https://github.com/firecracker-microvm/firecracker/releases"
    local tarball="firecracker-${FIRECRACKER_VERSION}-${vm_arch}.tgz"
    local download_url="${release_url}/download/${FIRECRACKER_VERSION}/${tarball}"

    limactl shell "$LIMA_VM_NAME" bash -c "
        set -euo pipefail
        ARCH=\$(uname -m)
        TMPDIR=\$(mktemp -d)
        trap 'rm -rf \$TMPDIR' EXIT

        echo 'Downloading $tarball...'
        curl -fSL '$download_url' -o \"\$TMPDIR/$tarball\"

        echo 'Extracting...'
        tar -xzf \"\$TMPDIR/$tarball\" -C \"\$TMPDIR\"

        RELEASE_DIR=\"\$TMPDIR/release-${FIRECRACKER_VERSION}-\$ARCH\"

        echo 'Installing binaries...'
        sudo install -m 0755 \"\$RELEASE_DIR/firecracker-${FIRECRACKER_VERSION}-\$ARCH\" /usr/local/bin/firecracker
        sudo install -m 0755 \"\$RELEASE_DIR/jailer-${FIRECRACKER_VERSION}-\$ARCH\" /usr/local/bin/jailer

        echo 'Verifying...'
        firecracker --version
        jailer --version
    "

    ok "Firecracker and Jailer installed inside Lima VM '$LIMA_VM_NAME'"
}

# ─── Main ────────────────────────────────────────────────────────────────────

main() {
    echo ""
    echo "  ┌──────────────────────────────────────┐"
    echo "  │   Firecracker & Jailer Setup          │"
    echo "  └──────────────────────────────────────┘"
    echo ""

    local os
    os="$(uname -s)"

    case "$os" in
        Linux)
            info "Detected OS: Linux"
            install_linux
            ;;
        Darwin)
            info "Detected OS: macOS"
            install_macos
            ;;
        *)
            die "Unsupported operating system: $os. Firecracker requires Linux (or macOS via Lima)."
            ;;
    esac
}

main
