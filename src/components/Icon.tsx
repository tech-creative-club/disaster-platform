import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface IconProps {
  emoji?: string;
  backgroundColor?: boolean;
  iconColor: string;
  height?: string;
}

export default function Icon({ emoji, backgroundColor = true, iconColor, height }: IconProps) {
  function Icon({ emoji, iconColor }: IconProps) {
    if (!emoji) return null;

    switch (emoji) {
      case '🏥':
        return <LocalHospitalIcon className="h-5 w-5" style={{ color: iconColor }} />;
      case '🏫':
        return <SchoolIcon className="h-5 w-5" style={{ color: iconColor }} />;
      default:
        return null;
    }
  }

  return (
    <span
      className={`flex ${
        !height && 'h-10 max-h-10 min-h-10 w-10 min-w-10 max-w-10'
      } items-center justify-center rounded-full ${backgroundColor && 'bg-zinc-500'}`}
    >
      {Icon({ emoji, iconColor })}
    </span>
  );
}
