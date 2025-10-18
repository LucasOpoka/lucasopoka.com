import React from 'react';
import { useAtom } from 'jotai';
import { Box, Typography, Tooltip } from '@mui/material';
import { cpuPercentageAtom, diskLatencyAtom } from '../WebVmAtoms';

interface WebVmFooterProps {
  onReset: () => Promise<void>;
}

export default function WebVmFooter({ onReset }: WebVmFooterProps): React.JSX.Element {
  const [cpuPercentage] = useAtom(cpuPercentageAtom);
  const [diskLatency] = useAtom(diskLatencyAtom);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}
    >
      <Tooltip 
        title={`CPU Usage: ${cpuPercentage}%`} 
        placement="left"
        slotProps={{
          tooltip: {
            sx: {
              fontFamily: 'inherit',
              color: 'secondary.main',
              backgroundColor: 'black',
              fontSize: '10px'
            }
          }
        }}
      >
        <Typography sx={{ 
          color: cpuPercentage > 10 ? 'secondary.main' : 'inherit',
          fontWeight: cpuPercentage > 10 ? 'bold' : 'normal'
        }}>
          CPU
        </Typography>
      </Tooltip>
      
      <Tooltip 
        title={`Disk Latency: ${diskLatency}ms`} 
        placement="left"
        slotProps={{
          tooltip: {
            sx: {
              fontFamily: 'inherit',
              color: 'secondary.main',
              backgroundColor: 'black',
              fontSize: '10px'
            }
          }
        }}
      >
        <Typography sx={{ 
          color: diskLatency > 5 ? 'secondary.main' : 'inherit',
          fontWeight: diskLatency > 5 ? 'bold' : 'normal'
        }}>
          Disk
        </Typography>
      </Tooltip>
      
      <Typography
        onClick={onReset}
        sx={{
          cursor: 'pointer',
          textDecoration: 'underline',
          '&:hover': {
            opacity: 0.7
          }
        }}
      >
        Reset Disk
      </Typography>
    </Box>
  );
}
