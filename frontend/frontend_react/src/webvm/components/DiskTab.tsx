import { useAtom } from 'jotai';
import { Box, Typography } from '@mui/material';
import { diskStateAtom } from '../WebVmAtoms';
import SmallButton from './SmallButton';

export default function DiskTab({ onReset }: { onReset: () => Promise<void> }) {
  const [diskState] = useAtom(diskStateAtom);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
        Disk
      </Typography>
      <Typography sx={{ marginBottom: '16px' }}>
        <Typography component="span" sx={{ fontWeight: 'bold' }}>Disk Latency: </Typography>{diskState.latency}ms
      </Typography>
      <Typography sx={{ marginBottom: '16px' }}>
        The virtual disk is implemented using IndexedDB for persistent storage. 
        Data is cached locally for improved performance.
      </Typography>
      <SmallButton
        buttonIcon="fa-solid fa-trash"
        clickHandler={onReset}
        buttonText="Reset Disk"
        bgColor="bg-red-600"
      />
      <Typography sx={{ marginTop: '16px', fontSize: '14px', color: '#9ca3af' }}>
        Warning: This will permanently delete all data on the virtual disk.
      </Typography>
    </Box>
  );
}
