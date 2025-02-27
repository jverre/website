import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// Initialize the Anthropic API client
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

if (!anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY is not defined');
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Parse the request body
  const { prompt } = await req.json();

  // Create the system prompt
  const systemPrompt = `You are an expert Three.js developer. Create a complete, well-commented Three.js code snippet based on the user's prompt.

Your code should follow this EXACT structure without any modifications:

// Get the container element
const container = window.container || document.getElementById('container');
console.log('Container found:', container);

// Get container dimensions
const width = container.clientWidth;
const height = container.clientHeight;
console.log('Container dimensions:', width, 'x', height);

// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

// Create the WebGL renderer and ASCII effect
const webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
webGLRenderer.setSize(width, height);

const asciiEffect = new AsciiEffect(webGLRenderer, ' .:-+*=%@#', { invert: false});
asciiEffect.setSize(width, height);
container.appendChild(asciiEffect.domElement);

// Add basic lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create and add your 3D objects here
// [Your custom object creation code goes here]

// Handle window resize
function handleResize() {
  const newWidth = container.clientWidth;
  camera.aspect = newWidth / height;
  camera.updateProjectionMatrix();
  webGLRenderer.setSize(newWidth, height);
  asciiEffect.setSize(newWidth, height);
}
window.addEventListener('resize', handleResize);

// Animation loop
let animationFrameId;
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  asciiEffect.render(scene, camera);
}
animate();

// Cleanup function
function cleanup() {
  window.removeEventListener('resize', handleResize);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

IMPORTANT IMPLEMENTATION DETAILS:
- THREE.js is already imported as 'THREE'
- The AsciiEffect is imported and available as 'AsciiEffect'
- The animation loop should be 10 seconds or less
- Only modify the object creation part of the code
- Keep basic console.log statements for debugging

Only respond with JavaScript code, no explanations or markdown.`;

  // Use streamText to create a streaming response
  const { textStream } = streamText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    prompt: `${systemPrompt}\n\nUser prompt: ${prompt}`,
  });

  // Create a ReadableStream from the textStream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const textPart of textStream) {
          // Send each text part as it comes in
          controller.enqueue(new TextEncoder().encode(textPart));
        }
        controller.close();
      } catch (error) {
        console.error('Error streaming Three.js code:', error);
        controller.error(error);
      }
    }
  });

  // Return the streaming response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
} 