import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { useXTerm } from 'react-xtermjs';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Box } from '@mui/material';
import '@xterm/xterm/css/xterm.css';
import { TerminalThemeSetter } from '../TerminalThemeSetter';
import { 
  cpuActivityAtom, 
  diskActivityAtom, 
  cpuPercentageAtom, 
  diskLatencyAtom,
  blockCacheAtom,
  cpuActivityEventsAtom,
  diskLatenciesAtom,
  activityEventsIntervalAtom
} from '../WebVmAtoms';
import { configObj } from '../config';
import WebVmFooter from './WebVmFooter';
import { useViewNavigation } from '../hooks/useViewNavigation';
import type { WebVMProps, ActivityEvent, CpuActivityCallback, DiskActivityCallback, DiskLatencyCallback } from '../../types/webvm';
import React from 'react';  
import type { CloudDevice, HttpBytesDevice, GitHubDevice, MountPointConfiguration } from '@leaningtech/cheerpx';
import type { Terminal } from '@xterm/xterm';

export const TERMINAL_WIDTH = 797;
export const TERMINAL_HEIGHT = 427;
export const BORDER_WIDTH = 7.5;
export const BORDER_HEIGHT = 15;

export default function WebVM({ cacheId, cpuActivityEvents = [], diskLatencies = [], activityEventsInterval = 0 }: WebVMProps): React.JSX.Element {
  const [, setCpuActivity] = useAtom(cpuActivityAtom);
  const [, setDiskActivity] = useAtom(diskActivityAtom);
  const [, setCpuPercentage] = useAtom(cpuPercentageAtom);
  const [, setDiskLatency] = useAtom(diskLatencyAtom);
  
  // WebVM component atoms
  const [blockCache, setBlockCache] = useAtom(blockCacheAtom);
  const [cpuActivityEventsState, setCpuActivityEventsState] = useAtom(cpuActivityEventsAtom);
  const [, setDiskLatenciesState] = useAtom(diskLatenciesAtom);
  const [activityEventsIntervalState, setActivityEventsIntervalState] = useAtom(activityEventsIntervalAtom);
  
  // Use react-xtermjs hook
  const { instance: term, ref: termRef } = useXTerm();

  // Reference to the CheerpX read function
  const cxReadFuncRef = useRef<((char: number) => void) | null>(null);

  const activityEventsIntervalRef = useRef(activityEventsInterval);
  activityEventsIntervalRef.current = activityEventsInterval;

  // Use the view navigation hook - only when CheerpX is ready
  useViewNavigation(term, cxReadFuncRef);
  

  // Initialize atoms with props
  useEffect(() => {
    setCpuActivityEventsState(cpuActivityEvents);
    setDiskLatenciesState(diskLatencies);
    setActivityEventsIntervalState(activityEventsInterval);
    activityEventsIntervalRef.current = activityEventsInterval;
  }, []); // Empty dependency array - only run on mount

  function writeData(buf: Uint8Array, vt: number): void {
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

  function readData(str: string): void {
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

  function printMessage(msg: string[]): void {
    if (term) {
      for (let i = 0; i < msg.length; i++) {
        term.write(msg[i] + "\n");
      }
    }
  }

  function expireEvents(list: ActivityEvent[], _curTime: number, limitTime: number): ActivityEvent[] {
    const newList = [...list];
    while (newList.length > 1) {
      if (newList[1].t < limitTime) {
        newList.shift();
      } else {
        break;
      }
    }
    return newList;
  }

  function cleanupEvents(): void {
    const curTime = Date.now();
    const limitTime = curTime - 10000;
    const newCpuEvents = expireEvents(cpuActivityEventsState, curTime, limitTime);
    setCpuActivityEventsState(newCpuEvents);
    computeCpuActivity(curTime, limitTime, newCpuEvents);
    
    if (newCpuEvents.length === 0) {
      if (activityEventsIntervalRef.current !== 0) {
        clearInterval(activityEventsIntervalRef.current);
        setActivityEventsIntervalState(0);
      }
    }
  }

  function computeCpuActivity(_curTime: number, limitTime: number, events: ActivityEvent[]): void {
    let totalActiveTime = 0;
    let lastActiveTime = limitTime;
    let lastWasActive = false;
    
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      let eTime = e.t;
      if (eTime < limitTime) eTime = limitTime;
      
      if (e.state === "ready") {
        totalActiveTime += (eTime - lastActiveTime);
        lastWasActive = false;
      } else {
        lastActiveTime = eTime;
        lastWasActive = true;
      }
    }
    
    if (lastWasActive) {
      totalActiveTime += (_curTime - lastActiveTime);
    }
    
    setCpuPercentage(Math.ceil((totalActiveTime / 10000) * 100));
  }

  const hddCallback: DiskActivityCallback = (state: string | number): void => {
    setDiskActivity(state !== "ready");
  };

  const latencyCallback: DiskLatencyCallback = (latency: string | number): void => {
    setDiskLatenciesState(prev => {
      const newLatencies = [...prev, Number(latency)];
      if (newLatencies.length > 30) {
        newLatencies.shift();
      }
      const total = newLatencies.reduce((sum, l) => sum + l, 0);
      const avg = total / newLatencies.length;
      setDiskLatency(Math.ceil(avg));
      return newLatencies;
    });
  };

  const cpuCallback: CpuActivityCallback = (state: string | number): void => {
    setCpuActivity(state !== "ready");
    const curTime = Date.now();
    const limitTime = curTime - 10000;
    const newEvents = expireEvents(cpuActivityEventsState, curTime, limitTime);
    const updatedEvents = [...newEvents, { t: curTime, state: state as 'ready' | 'active' }];
    setCpuActivityEventsState(updatedEvents);
    computeCpuActivity(curTime, limitTime, updatedEvents);
    
    if (activityEventsIntervalState !== 0) {
      clearInterval(activityEventsIntervalState);
    }
    const interval = setInterval(cleanupEvents, 2000) as unknown as number;
    setActivityEventsIntervalState(interval);
    activityEventsIntervalRef.current = interval;
  }


  async function initTerminal(): Promise<void> {
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
    term.onData(readData);
    console.log('Terminal setup complete, onData handler attached');

    try {
      await initCheerpX(term);
    } catch (e) {
      printMessage(["Unexpected error occurred:"]);
      printMessage([(e as Error).toString()]);
      return;
    }
  }

  async function initCheerpX(terminalInstance: Terminal): Promise<void> {
    console.log('Starting CheerpX initialization...');
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
      
      terminalInstance.scrollToBottom();
      const readFunc = cheerpX.setCustomConsole(writeData, terminalInstance.cols, terminalInstance.rows);
      console.log('CheerpX console connected, readFunc:', readFunc, 'cols:', terminalInstance.cols, 'rows:', terminalInstance.rows);
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
      printMessage(["Unexpected error occurred: "]);
      printMessage([(e as Error).toString()]);
      return;
    }
  }

  async function handleReset(): Promise<void> {
    if (blockCache === null) return;
    await blockCache.reset();
    location.reload();
  }

  useEffect(() => {
    if (!term) {
      return;
    }

    initTerminal();
  }, [term]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (activityEventsIntervalState !== 0) {
        clearInterval(activityEventsIntervalState);
      }
      if (term) {
        term.dispose();
      }
    };
  }, []);

  return (
    <Box>
      <Box
        ref={termRef}
        sx={{
          mt: 2,
          height: `${TERMINAL_HEIGHT}px`,
          width: `${TERMINAL_WIDTH}px`,
          border: '1px solid #87ff8755',
          boxShadow: '0 0 200px #87ff8734',
          position: 'relative'
        }}
      />
      <WebVmFooter onReset={handleReset} />
    </Box>
  );
}
