import React from 'react';
import { FaHospital, FaSchool } from 'react-icons/fa';

interface IconProps {
  emoji?: string;
}

export default function Icon({ emoji }: IconProps) {
  function Icon({ emoji }: IconProps) {
    switch (emoji) {
      case '🏥':
        return <FaHospital className="h-5 w-5 fill-zinc-50 pb-0.5" />;
      case '🏫':
        return <FaSchool className="h-5 w-5 fill-zinc-50 pb-1" />;
      default:
        return null;
    }
  }

  return (
    <span className="mr-3 flex h-10 max-h-10 min-h-10 w-10 min-w-10 max-w-10 items-center justify-center rounded-full bg-zinc-500">
      {Icon({ emoji })}
    </span>
  );
}
