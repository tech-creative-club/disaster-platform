'use client';

import React, { useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { Feature, Geometry, GeoJsonProperties, Point } from 'geojson';
import PointerDatails from './PointerDetails';

interface Props {
  title: string;
  feature: Feature<Geometry, GeoJsonProperties> | undefined;
  center: Feature<Point, GeoJsonProperties> | undefined;
  onClickMarker: (center: Feature<Point, GeoJsonProperties> | undefined) => void;
  zIndex: number;
  style?: {
    color?: string;
    fillColor?: string;
    emoji?: string;
  };
  index: number;
  children?: React.ReactNode;
  printMode?: boolean;
}

export default function Pointer({
  title,
  feature,
  center,
  onClickMarker,
  zIndex,
  style,
  index,
  children,
  printMode,
}: Props): React.JSX.Element {
  const [isHover, setIsHover] = useState<boolean>(false);

  if (!feature || !center) {
    return <span>null</span>;
  }

  const address: string = feature.properties?.['KSJ2:AdminArea'] + ' ' + feature.properties?.['KSJ2:ADS'];

  return (
    <Marker
      key={feature?.id}
      longitude={center.geometry.coordinates[0]}
      latitude={center.geometry.coordinates[1]}
      onClick={() => onClickMarker(center)}
      style={{ zIndex: isHover ? zIndex * 2 : zIndex }}
      className="items=center justify-center"
    >
      {isHover && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <PointerDatails title={title} address={address} />
        </div>
      )}
      <div
        // title={title}
        className="relative z-50 flex h-7 w-7 -rotate-[135deg] cursor-pointer items-center justify-center overflow-hidden rounded-bl-3xl rounded-br-3xl rounded-tr-3xl border-2 border-zinc-900 text-center text-base"
        style={{
          backgroundColor: style?.fillColor ? style.fillColor : 'rgba(255, 255, 255, 0.7)',
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="relative z-50 rotate-[135deg] text-center text-base">
          <span
            className="z-50 text-center text-base"
            style={{
              color: style?.color ? style.color : 'rgba(0, 0, 0, 0.8)',
            }}
          >
            {printMode ? index + 1 : children}
          </span>
        </div>
      </div>
    </Marker>
  );
}
