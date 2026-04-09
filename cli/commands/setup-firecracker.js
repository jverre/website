const { execSync, execFileSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

// ─── Config ──────────────────────────────────────────────────────────────────

const INSTALL_DIR = "/usr/local/bin";
const LIMA_VM_NAME = "firecracker";
const LIMA_CPUS = 2;
const LIMA_MEMORY = "2GiB";
const LIMA_DISK = "20GiB";

// ─── Output helpers ──────────────────────────────────────────────────────────

const info = (msg) => console.log(`\x1b[1;34m[info]\x1b[0m  ${msg}`);
const ok = (msg) => console.log(`\x1b[1;32m[ok]\x1b[0m    ${msg}`);
const warn = (msg) => console.log(`\x1b[1;33m[warn]\x1b[0m  ${msg}`);
const err = (msg) => console.error(`\x1b[1;31m[error]\x1b[0m ${msg}`);

function die(msg) {
  err(msg);
  process.exit(1);
}

function shell(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf-8", stdio: "pipe", ...opts }).trim();
}

function shellLive(cmd) {
  execSync(cmd, { encoding: "utf-8", stdio: "inherit" });
}

function commandExists(name) {
  try {
    execFileSync("which", [name], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// ─── Parse args ──────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(3); // skip node, cli/index.js, command name
  const parsed = { version: "" };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--version":
        parsed.version = args[++i];
        if (!parsed.version) die("--version requires a value (e.g. v1.14.2)");
        break;
      case "--help":
      case "-h":
        console.log("");
        console.log("  Usage: website-cli setup-firecracker [options]");
        console.log("");
        console.log("  Options:");
        console.log("    --version <tag>   Pin a specific Firecracker release (e.g. v1.14.2)");
        console.log("    --help            Show this help message");
        console.log("");
        console.log("  On Linux:  Checks KVM, downloads binaries, installs to /usr/local/bin.");
        console.log("  On macOS:  Provisions a Lima Linux VM and installs Firecracker inside it.");
        console.log("");
        process.exit(0);
      default:
        die(`Unknown option: ${args[i]}. Use --help for usage.`);
    }
  }

  return parsed;
}

// ─── Resolve version ─────────────────────────────────────────────────────────

function resolveVersion(pinned) {
  if (pinned) {
    info(`Using pinned version: ${pinned}`);
    return pinned;
  }

  info("Resolving latest Firecracker release...");
  const url =
    "https://github.com/firecracker-microvm/firecracker/releases/latest";
  // curl follows the redirect; the final URL contains the tag
  const effectiveUrl = shell(
    `curl -fsSLI -o /dev/null -w '%{url_effective}' "${url}"`
  );
  const version = path.basename(effectiveUrl);
  info(`Latest version: ${version}`);
  return version;
}

// ─── Linux install ───────────────────────────────────────────────────────────

function checkKvm() {
  if (!fs.existsSync("/dev/kvm")) {
    die(
      "KVM is not available (/dev/kvm not found).\n" +
        "Firecracker requires hardware virtualization (Intel VT-x / AMD-V).\n" +
        "If running in a VM, enable nested virtualization in your hypervisor."
    );
  }

  try {
    fs.accessSync("/dev/kvm", fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    warn("/dev/kvm exists but the current user lacks read/write access.");
    info(
      "Fix with: sudo chmod 666 /dev/kvm  (or add your user to the kvm group)"
    );
  }

  ok("KVM is available");
}

function installLinux(version) {
  const arch = os.arch() === "x64" ? "x86_64" : os.arch() === "arm64" ? "aarch64" : os.arch();

  info(`Detected architecture: ${arch}`);

  if (arch !== "x86_64" && arch !== "aarch64") {
    die(
      `Unsupported architecture: ${arch}. Firecracker supports x86_64 and aarch64.`
    );
  }

  checkKvm();

  if (!commandExists("curl")) die("'curl' is required but not found.");
  if (!commandExists("tar")) die("'tar' is required but not found.");

  const releaseUrl =
    "https://github.com/firecracker-microvm/firecracker/releases";
  const tarball = `firecracker-${version}-${arch}.tgz`;
  const downloadUrl = `${releaseUrl}/download/${version}/${tarball}`;

  const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-setup-"));

  try {
    info(`Downloading ${tarball}...`);
    try {
      shell(`curl -fSL "${downloadUrl}" -o "${tmpdir}/${tarball}"`);
    } catch {
      die(
        `Download failed. Check that version ${version} exists at:\n${downloadUrl}`
      );
    }

    info("Extracting...");
    shell(`tar -xzf "${tmpdir}/${tarball}" -C "${tmpdir}"`);

    const releaseDir = `${tmpdir}/release-${version}-${arch}`;
    const fcBin = `${releaseDir}/firecracker-${version}-${arch}`;
    const jailerBin = `${releaseDir}/jailer-${version}-${arch}`;

    if (!fs.existsSync(fcBin)) die(`Expected binary not found: ${fcBin}`);
    if (!fs.existsSync(jailerBin))
      die(`Expected binary not found: ${jailerBin}`);

    info(`Installing binaries to ${INSTALL_DIR}...`);

    let sudo = "";
    try {
      fs.accessSync(INSTALL_DIR, fs.constants.W_OK);
    } catch {
      sudo = "sudo ";
      info(`Using sudo to write to ${INSTALL_DIR}`);
    }

    shell(`${sudo}install -m 0755 "${fcBin}" "${INSTALL_DIR}/firecracker"`);
    shell(`${sudo}install -m 0755 "${jailerBin}" "${INSTALL_DIR}/jailer"`);

    ok(`Installed firecracker -> ${INSTALL_DIR}/firecracker`);
    ok(`Installed jailer     -> ${INSTALL_DIR}/jailer`);

    console.log("");
    info("Verifying installation...");
    shellLive("firecracker --version");
    shellLive("jailer --version");
    console.log("");
    ok("Firecracker and Jailer are ready!");
  } finally {
    fs.rmSync(tmpdir, { recursive: true, force: true });
  }
}

// ─── macOS install (via Lima) ────────────────────────────────────────────────

function createLimaVm() {
  const config = `
# Lima VM for Firecracker development
images:
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release/ubuntu-24.04-server-cloudimg-amd64.img"
    arch: "x86_64"
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release/ubuntu-24.04-server-cloudimg-arm64.img"
    arch: "aarch64"

cpus: ${LIMA_CPUS}
memory: "${LIMA_MEMORY}"
disk: "${LIMA_DISK}"

nestedVirtualization: true

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
      apt-get update -qq
      apt-get install -y -qq qemu-kvm curl tar iptables iproute2 > /dev/null
      if [ -e /dev/kvm ]; then
          chmod 666 /dev/kvm
      fi
`.trimStart();

  const tmpFile = path.join(
    os.tmpdir(),
    `lima-firecracker-${Date.now()}.yaml`
  );
  fs.writeFileSync(tmpFile, config);

  try {
    info("Creating Lima VM (this may take a few minutes)...");
    shellLive(
      `limactl create --name="${LIMA_VM_NAME}" "${tmpFile}" --tty=false`
    );
    info("Starting Lima VM...");
    shellLive(`limactl start "${LIMA_VM_NAME}"`);
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

function installFirecrackerInLima(version) {
  info(`Installing Firecracker ${version} inside Lima VM...`);

  const vmArch = shell(`limactl shell "${LIMA_VM_NAME}" uname -m`);
  const releaseUrl =
    "https://github.com/firecracker-microvm/firecracker/releases";
  const tarball = `firecracker-${version}-${vmArch}.tgz`;
  const downloadUrl = `${releaseUrl}/download/${version}/${tarball}`;

  const script = `
    set -euo pipefail
    ARCH=$(uname -m)
    TMPDIR=$(mktemp -d)
    trap 'rm -rf $TMPDIR' EXIT

    echo "Downloading ${tarball}..."
    curl -fSL "${downloadUrl}" -o "$TMPDIR/${tarball}"

    echo "Extracting..."
    tar -xzf "$TMPDIR/${tarball}" -C "$TMPDIR"

    RELEASE_DIR="$TMPDIR/release-${version}-$ARCH"

    echo "Installing binaries..."
    sudo install -m 0755 "$RELEASE_DIR/firecracker-${version}-$ARCH" /usr/local/bin/firecracker
    sudo install -m 0755 "$RELEASE_DIR/jailer-${version}-$ARCH" /usr/local/bin/jailer

    echo "Verifying..."
    firecracker --version
    jailer --version
  `;

  shellLive(`limactl shell "${LIMA_VM_NAME}" bash -c '${script.replace(/'/g, "'\\''")}'`);
  ok(`Firecracker and Jailer installed inside Lima VM '${LIMA_VM_NAME}'`);
}

function installMacOS(version) {
  info(
    "Firecracker requires Linux with KVM — it cannot run natively on macOS."
  );
  info("Setting up a Lima Linux VM with KVM support to run Firecracker.");
  console.log("");

  if (!commandExists("brew")) {
    die("Homebrew is required on macOS. Install it from https://brew.sh");
  }

  if (!commandExists("limactl")) {
    info("Installing Lima via Homebrew...");
    shellLive("brew install lima");
    ok("Lima installed");
  } else {
    ok("Lima is already installed");
  }

  // Check if VM already exists
  let vmExists = false;
  let vmRunning = false;
  try {
    const list = shell("limactl list -q 2>/dev/null");
    vmExists = list.split("\n").includes(LIMA_VM_NAME);
    if (vmExists) {
      const json = shell(`limactl list --json 2>/dev/null`);
      vmRunning = json.includes('"status":"Running"');
    }
  } catch {
    // limactl list failed — no VMs exist
  }

  if (vmExists && vmRunning) {
    ok(`Lima VM '${LIMA_VM_NAME}' is already running`);
  } else if (vmExists) {
    info(`Starting existing Lima VM '${LIMA_VM_NAME}'...`);
    shellLive(`limactl start "${LIMA_VM_NAME}"`);
    ok(`Lima VM '${LIMA_VM_NAME}' started`);
  } else {
    createLimaVm();
    ok(`Lima VM '${LIMA_VM_NAME}' created and started`);
  }

  installFirecrackerInLima(version);

  console.log("");
  ok("Setup complete!");
  console.log("");
  info("To use Firecracker, shell into the Lima VM:");
  console.log("");
  console.log(`  limactl shell ${LIMA_VM_NAME}`);
  console.log("");
  info("Inside the VM, both 'firecracker' and 'jailer' are available.");
  info(`To stop the VM:   limactl stop ${LIMA_VM_NAME}`);
  info(`To delete the VM: limactl delete ${LIMA_VM_NAME}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function run() {
  const { version: pinnedVersion } = parseArgs();

  console.log("");
  console.log("  ┌──────────────────────────────────────┐");
  console.log("  │   Firecracker & Jailer Setup          │");
  console.log("  └──────────────────────────────────────┘");
  console.log("");

  const version = resolveVersion(pinnedVersion);
  const platform = os.platform();

  switch (platform) {
    case "linux":
      info("Detected OS: Linux");
      installLinux(version);
      break;
    case "darwin":
      info("Detected OS: macOS");
      installMacOS(version);
      break;
    default:
      die(
        `Unsupported operating system: ${platform}. Firecracker requires Linux (or macOS via Lima).`
      );
  }
}

module.exports = { run };
