import { createBridgeClient, createWindowTransport } from "@fillasap/bridge";
import type { Detection } from "@fillasap/bridge";
import type { Snapshot } from "@fillasap/domain";

export type ExtensionDetection = Detection;

/** The website's only door to the extension. */
export interface ExtensionGateway {
  detect(): Promise<ExtensionDetection>;
  loadSnapshot(): Promise<Snapshot>;
}

export function createExtensionGateway(options: { timeoutMs?: number } = {}): ExtensionGateway {
  const client = createBridgeClient(createWindowTransport(), options);
  return {
    detect: () => client.detect(),
    loadSnapshot: () => client.request("getSnapshot"),
  };
}
