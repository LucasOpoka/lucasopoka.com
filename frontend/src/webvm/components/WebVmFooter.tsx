import React from 'react';
import { useAtom } from 'jotai';
import { Box, Typography, Tooltip } from '@mui/material';
import { cpuStateAtom, diskStateAtom } from '../WebVmAtoms';

interface WebVmFooterProps {
  onReset: () => Promise<void>;
}

export default function WebVmFooter({ onReset }: WebVmFooterProps): React.JSX.Element {
  const [cpuState] = useAtom(cpuStateAtom);
  const [diskState] = useAtom(diskStateAtom);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}
    >
      <Tooltip 
        title={`CPU Usage: ${cpuState.percentage}%`} 
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
          color: cpuState.activity ? 'secondary.main' : 'inherit',
          fontWeight: cpuState.activity ? 'bold' : 'normal'
        }}>
          CPU
        </Typography>
      </Tooltip>
      
      <Tooltip 
        title={`Disk Latency: ${diskState.latency}ms`} 
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
          color: diskState.activity ? 'secondary.main' : 'inherit',
          fontWeight: diskState.activity ? 'bold' : 'normal',
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
