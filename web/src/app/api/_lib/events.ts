// Lightweight cross-request event bus using Node's BroadcastChannel.
// In serverless this may not persist, but fine for local dev/tests.
let channel: BroadcastChannel | null = null;

export function getDisplayChannel(): BroadcastChannel | null {
  try {
    if (!channel) {
      // Prefer global BroadcastChannel if available; otherwise lazy import from node:worker_threads
      const g = globalThis as unknown as { BroadcastChannel?: typeof BroadcastChannel };
      const GlobalBC = g.BroadcastChannel;
      if (GlobalBC) {
        channel = new GlobalBC('display-surgeries');
      } else {
        // dynamic import without require()
        return null; // fallback: skip channel in environments without BroadcastChannel
      }
    }
    return channel;
  } catch {
    return null;
  }
}

export type DisplayUpdate = { type: 'display-update'; payload?: unknown };

export function broadcastDisplayUpdate(update: DisplayUpdate) {
  const ch = getDisplayChannel();
  if (ch) ch.postMessage(update);
}


