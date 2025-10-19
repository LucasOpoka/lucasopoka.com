import { WebLinksAddon } from '@xterm/addon-web-links';
import { TerminalThemeSetter } from '../TerminalThemeSetter';
import { configObj } from '../config';
import type { CloudDevice, HttpBytesDevice, GitHubDevice, MountPointConfiguration, IDBDevice } from '@leaningtech/cheerpx';
import type { Terminal } from '@xterm/xterm';

export interface InitTerminalParams {
  term: Terminal | null;
  cxReadFuncRef: React.RefObject<((char: number) => void) | null>;
  setBlockCache: (cache: IDBDevice) => void;
  hddCallback: (state: string | number) => void;
  latencyCallback: (latency: string | number) => void;
  cpuCallback: (state: string | number) => void;
  cacheId?: string;
}

function writeData(term: Terminal, buf: Uint8Array, vt: number): void {
  console.log('writeData called with buf:', buf, 'vt:', vt);
  if (vt !== 1) {
    console.log('Ignoring writeData, vt !== 1');
    return;
  }
  if (term) {
    console.log('Writing to terminal:', buf);
    term.write(buf);
  } else {
    console.log('Terminal instance is null, cannot write');
  }
}

function readData(cxReadFuncRef: React.RefObject<((char: number) => void) | null>, str: string): void {
  console.log('readData called with:', str, 'cxReadFuncRef.current:', cxReadFuncRef.current);
  if (cxReadFuncRef.current === null) {
    console.log('cxReadFuncRef is null, ignoring input');
    return;
  }
  console.log('Sending input to CheerpX:', str);
  try {
    for (let i = 0; i < str.length; i++) {
      cxReadFuncRef.current(str.charCodeAt(i));
    }
    console.log('Successfully sent input to CheerpX');
  } catch (error) {
    console.error('Error sending input to CheerpX:', error);
  }
}


export function initTerminal(
  term: Terminal | null,
  cxReadFuncRef: React.RefObject<((char: number) => void) | null>
): void {
  if (!term) {
    return;
  }
  
  console.log('Setting up terminal with react-xtermjs...');
  
  // Apply terminal theme
  TerminalThemeSetter(term);
  
  // Configure additional terminal options
  term.options.convertEol = true;
  
  const linkAddon = new WebLinksAddon();
  
  // Set terminal dimensions (columns x rows)
  term.resize(102, 25);

  // Load the web links addon
  term.loadAddon(linkAddon);
  
  term.scrollToTop();
  term.focus();
  term.onData((str: string) => readData(cxReadFuncRef, str));
  console.log('Terminal setup complete, onData handler attached');
}

export async function initCheerpX({
  term,
  cxReadFuncRef,
  setBlockCache,
  hddCallback,
  latencyCallback,
  cpuCallback,
  cacheId
}: Omit<InitTerminalParams, 'readData' | 'printMessage'>): Promise<void> {
  console.log('Starting CheerpX initialization...');
  if (!term) {
    return;
  }
  try {
    console.log('Importing CheerpX...');
    const CheerpX = await import('@leaningtech/cheerpx');
    console.log('CheerpX imported successfully:', CheerpX);
    console.log('Available CheerpX methods:', Object.keys(CheerpX));
    let blockDevice: CloudDevice | HttpBytesDevice | GitHubDevice | null = null;
    
    console.log('Config object:', configObj);
    console.log('Disk image type:', configObj.diskImageType);
    console.log('Disk image URL:', configObj.diskImageUrl);
    
    switch (configObj.diskImageType) {
    case "cloud":
      console.log('Creating CloudDevice...');
      try {
        blockDevice = await CheerpX.CloudDevice.create(configObj.diskImageUrl);
      } catch (e) {
        console.log('CloudDevice creation failed, trying WSS fallback...');
        const wssProtocol = "wss:";
        if (configObj.diskImageUrl.startsWith(wssProtocol)) {
          blockDevice = await CheerpX.CloudDevice.create("https:" + configObj.diskImageUrl.substr(wssProtocol.length));
        } else {
          throw e;
        }
      }
      break;
    case "bytes":
      console.log('Creating HttpBytesDevice...');
      blockDevice = await CheerpX.HttpBytesDevice.create(configObj.diskImageUrl);
      break;
    case "github":
      console.log('Creating GitHubDevice...');
      blockDevice = await CheerpX.GitHubDevice.create(configObj.diskImageUrl);
      break;
    default:
      throw new Error("Unrecognized device type");
    }
  
    console.log('Block device created successfully:', blockDevice);
    
    const cache = await CheerpX.IDBDevice.create(cacheId || "blocks_terminal");
    const overlayDevice = await CheerpX.OverlayDevice.create(blockDevice, cache);
    const homeDevice = await CheerpX.WebDevice.create("home");
    const pongDevice = await CheerpX.WebDevice.create("pong");
    const contactDevice = await CheerpX.WebDevice.create("contact");
    const dataDevice = await CheerpX.DataDevice.create();
    
    const mountPoints: MountPointConfiguration[] = [
      { type: "ext2", dev: overlayDevice, path: "/" },
      { type: "dir", dev: dataDevice, path: "/data" },
      { type: "dir", dev: homeDevice, path: "/home/user/home" },
      { type: "dir", dev: pongDevice, path: "/home/user/pong" },
      { type: "dir", dev: contactDevice, path: "/home/user/contact" }
    ];
  
    console.log('Creating CheerpX Linux instance...');
    console.log('Mount points:', mountPoints);
    
    const cheerpX = await CheerpX.Linux.create({ 
      mounts: mountPoints, 
    });
    console.log('CheerpX Linux instance created successfully:', cheerpX);
    
    cheerpX.registerCallback("cpuActivity", cpuCallback);
    cheerpX.registerCallback("diskActivity", hddCallback);
    cheerpX.registerCallback("diskLatency", latencyCallback);
    
    term.scrollToBottom();
    const readFunc = cheerpX.setCustomConsole((buf: Uint8Array, vt: number) => writeData(term, buf, vt), term.cols, term.rows);
    console.log('CheerpX console connected, readFunc:', readFunc, 'cols:', term.cols, 'rows:', term.rows);
    cxReadFuncRef.current = readFunc;
    
    setBlockCache(cache);

    // Create /dev/null
    await cheerpX.run("/bin/bash", ["-c", "echo -n > /dev/null || true"], configObj.opts);
    
    // Run the command in a loop asynchronously
    (async () => {
      while (true) {
        await cheerpX.run(configObj.cmd, configObj.args, configObj.opts);
      }
    })();
  } catch (e) {
    console.error('CheerpX initialization failed:', e);
    throw e;
  }
}
