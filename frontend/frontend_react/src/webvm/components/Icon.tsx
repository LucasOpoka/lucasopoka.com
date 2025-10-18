import React from 'react';
import { useAtom } from 'jotai';
import { Box } from '@mui/material';
import type { IconProps } from '../../types/webvm';

export default function Icon({ icon, info, activity, onMouseover, onClick }: IconProps): React.JSX.Element {
  const [activityValue] = useAtom(activity);

  function handleMouseover(): void {
    onMouseover(info);
  }

  function handleClick(): void {
    onClick({ icon, info, activity });
  }

  return (
    <Box 
      sx={{
        padding: '12px',
        cursor: 'pointer',
        textAlign: 'center',
        color: activityValue ? '#f59e0b' : '#d1d5db',
        animation: activityValue ? 'pulse 0.5s infinite' : 'none'
      }}
      onMouseEnter={handleMouseover}
      onClick={handleClick}
    >
      <i className={`${icon} fa-xl`} />
    </Box>
  );
}
