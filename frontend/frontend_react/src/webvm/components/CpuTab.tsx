import React from 'react';
import { useAtom } from 'jotai';
import { Box, Typography } from '@mui/material';
import { cpuPercentageAtom } from '../WebVmAtoms';
export default function CpuTab(): React.JSX.Element {
  const [cpuPercentage] = useAtom(cpuPercentageAtom);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
        Engine
      </Typography>
      <Typography sx={{ marginTop: '16px' }}>
        <Typography component="span" sx={{ fontWeight: 'bold' }}>Virtual CPU: </Typography>{cpuPercentage}%
      </Typography>
    </Box>
  );
}
