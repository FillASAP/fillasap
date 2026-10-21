import { createBridgeHost, createWindowTransport } from "@fillasap/bridge";
import { browser } from "wxt/browser";
import { createForwardingHandler } from "@/content/forward";

export function startContentBridge(): void {
  createBridgeHost(
    createWindowTransport(),
    createForwardingHandler((message) => browser.runtime.sendMessage(message)),
    browser.runtime.getManifest().version,
  );
}
