import React from 'react';
import { Button, Box } from '@mui/material';
import type { SmallButtonProps } from '../../types/webvm';

export default function SmallButton({ buttonIcon, clickHandler, buttonText, buttonTooltip, bgColor }: SmallButtonProps): React.JSX.Element {
  const getButtonColor = () => {
    switch (bgColor) {
    case 'bg-blue-600': return '#2563eb';
    case 'bg-red-600': return '#dc2626';
    case 'bg-gray-600': return '#4b5563';
    default: return '#374151';
    }
  };

  return (
    <Button
      onClick={clickHandler}
      title={buttonTooltip}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: getButtonColor(),
        color: '#f3f4f6',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: bgColor === 'bg-blue-600' ? '#1d4ed8' :
            bgColor === 'bg-red-600' ? '#b91c1c' :
              bgColor === 'bg-gray-600' ? '#374151' : '#1f2937'
        }
      }}
    >
      {buttonIcon && (
        <Box component="i" className={buttonIcon} sx={{ marginRight: '8px' }} />
      )}
      {buttonText}
    </Button>
  );
}
