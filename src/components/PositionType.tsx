import { t } from 'i18next';
import React from 'react';

interface PositionTypeProps {
  emoji?: string;
  index: number;
  geoIndex: number;
}

export default function PositionType({ emoji, index, geoIndex }: PositionTypeProps) {
  return (
    <>
      {emoji === '🏥' && index === 0 && geoIndex === 0 && (
        <span className="my-2 flex h-10 items-end truncate pl-5">{t("病院")}</span>
      )}
      {emoji === '🏫' && index === 0 && geoIndex === 1 && (
        <span className="my-2 flex h-10 items-end truncate pl-5">{t("学校")}</span>
      )}
    </>
  );
}
