import { configObj } from '../config';
import { createWebVmCallbacks } from './WebVmCallbacks';
import type { MountPointConfiguration } from '@leaningtech/cheerpx';
import type { Terminal } from '@xterm/xterm';
import {
  blockCacheAtom,
  cxReadFuncAtom,
} from '../WebVmAtoms';
import { getDefaultStore } from 'jotai';

const CACHE_ID = "terminal_cache";

const store = getDefaultStore();

function writeData(term: Terminal, buf: Uint8Array, vt: number): void {
  if (vt !== 1) {
    return;
  }
  if (term) {
    term.write(buf);
  } else {
    console.log('Terminal instance is null, cannot write');
  }
}

function readData(str: string, readFunc: ((char: number) => void) | null): void {
  if (!readFunc) {
    console.log('cxReadFunc is not available or not a function, ignoring input');
    return;
  }
  try {
    for (let i = 0; i < str.length; i++) {
      readFunc(str.charCodeAt(i));
    }
  } catch (error) {
    console.error('Error sending input to CheerpX:', error);
  }
}


export async function initCheerpX(term: Terminal | null): Promise<void> {
  if (!term) {
    console.log('Terminal is null, aborting VM initialization');
    return;
  }

  try {
    const CheerpX = await import('@leaningtech/cheerpx');

    console.log('Creating device...');
    const blockDevice = await CheerpX.GitHubDevice.create(configObj.diskImageUrl);

    console.log('Block device created successfully:', blockDevice);

    const cache = await CheerpX.IDBDevice.create(CACHE_ID);
    const overlayDevice = await CheerpX.OverlayDevice.create(blockDevice, cache);
    const dataDevice = await CheerpX.DataDevice.create();

    const mountPoints: MountPointConfiguration[] = [
      { type: "ext2", dev: overlayDevice, path: "/" },
      { type: "dir", dev: dataDevice, path: "/data" },
    ];

    console.log('Creating CheerpX Linux instance...');
    console.log('Mount points:', mountPoints);

    const cheerpX = await CheerpX.Linux.create({
      mounts: mountPoints,
    });
    console.log('CheerpX Linux instance created successfully:', cheerpX);

    // Create callbacks
    const { hddCallback, latencyCallback, cpuCallback } = createWebVmCallbacks();

    cheerpX.registerCallback("cpuActivity", cpuCallback);
    cheerpX.registerCallback("diskActivity", hddCallback);
    cheerpX.registerCallback("diskLatency", latencyCallback);

    term.scrollToBottom();
    const readFunc = cheerpX.setCustomConsole((buf: Uint8Array, vt: number) => writeData(term, buf, vt), term.cols, term.rows);
    console.log('CheerpX console connected, readFunc:', readFunc, 'cols:', term.cols, 'rows:', term.rows);

    // Set the read function in the atom
    store.set(cxReadFuncAtom, { func: readFunc });

    // Set up the terminal data handler
    term.onData((str: string) => readData(str, readFunc));

    // Set the block cache
    store.set(blockCacheAtom, cache);

    // Create /dev/null
    await cheerpX.run("/bin/bash", ["-c", "echo -n > /dev/null || true"], configObj.opts);

    // Run the command in a loop asynchronously
    (async () => {
      while (true) {
        await cheerpX.run(configObj.cmd, configObj.args, configObj.opts);
      }
    })();

    console.log('CheerpX initialization completed successfully!');
  } catch (e) {
    console.error('CheerpX initialization failed:', e);
    throw e;
  }
}
