// @ts-ignore
import * as turf from '@turf/turf';

import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { Fragment, useCallback, useEffect } from 'react';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';
import { usePathname } from 'next/navigation';
import Pointer from './Pointer';
import Icon from './Icon';

function calculateCenterFromGeometry(feature: any) {
  switch (feature.geometry.type) {
    case 'Polygon':
      const polygonFeatures = turf.polygon(feature.geometry.coordinates);
      return turf.centroid(polygonFeatures);
    case 'MultiPolygon':
      const multiPolygonFeatures = turf.multiPolygon(feature.geometry.coordinates);
      return turf.centroid(multiPolygonFeatures);
    case 'LineString':
      const bbox = turf.bbox(feature);
      const polygon = turf.bboxPolygon(bbox);
      return turf.centroid(polygon);
    case 'Point':
      return turf.point(feature.geometry.coordinates);
    default:
      return undefined;
  }
}

export const GeoJsonToSomethings: React.FC<{
  geojson?: FeatureCollection;
  emoji?: string;
  style?: {
    color?: string;
    fillColor?: string;
    emoji?: string;
  };
  printMode?: boolean;
  isProduction?: boolean;
}> = ({ geojson, style, printMode, isProduction }) => {
  const { current: map } = useMap();

  const onClickMarker = useCallback(
    (center: Feature<Point, GeoJsonProperties> | undefined) => {
      if (map === undefined || center === undefined) {
        return;
      }
      const zoomTo = map.getZoom() < 10 ? 10 : 14;
      map.flyTo({
        center: [center.geometry.coordinates[0], center.geometry.coordinates[1]],
        zoom: zoomTo,
      });
    },
    [map]
  );

  // URL変更時に実行される処理
  const pathname = usePathname();

  useEffect((): void => {
    const url = `${pathname}`;
    const parts = url.split('/').filter(Boolean);
    const amenity = parts[0];
    const id = parts[1];

    // デバッグ用
    if (!isProduction) {
      console.log({ amenity, id, path: url }); // Output Example: {"school", "0123456789", "/school/0123456789"}
      console.log('The path has been updated: ' + url); // 開発環境時のみ実行
    }

    if (!geojson?.features) return;
    for (const feature of geojson?.features) {
      if (feature.properties?.amenity === amenity && String(feature.id).includes(id)) {
        let center: Feature<Point, GeoJsonProperties> | undefined = undefined;
        center = calculateCenterFromGeometry(feature);
        onClickMarker(center);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (geojson === undefined || geojson.features === undefined) {
    return null;
  }

  return (
    <>
      {geojson.features.map((feature, index) => {
        if (feature.geometry === undefined) {
          return null;
        }
        if (
          feature.geometry.type !== 'Polygon' &&
          feature.geometry.type !== 'MultiPolygon' &&
          feature.geometry.type !== 'LineString' &&
          feature.geometry.type !== 'Point'
        ) {
          return null;
        }

        let zIndex = 100;
        let title = 'No name';

        if (feature.properties && feature.properties.name && feature.properties.name.length > 0) {
          title = feature.properties.name;
        }

        // United Nations
        if (
          (feature.properties &&
            feature.properties.operator &&
            (feature.properties.operator.includes('UN') ||
              feature.properties.operator.includes('United Nations'))) ||
          (feature.properties &&
            feature.properties.name &&
            (feature.properties.name.includes('UN') || feature.properties.name.includes('United Nations')))
        ) {
          zIndex = 110;
        }

        let center: Feature<Point, GeoJsonProperties> | undefined = undefined;
        center = calculateCenterFromGeometry(feature);
        if (center === undefined) {
          return null;
        }

        return (
          <Fragment key={`${feature.id}-${index}`}>
            {feature.geometry.type === 'LineString' && (
              <Source type="geojson" data={feature}>
                {
                  <Layer
                    {...{
                      id: `${feature.id}-line`,
                      type: 'line',
                      paint: {
                        'line-width': 4,
                        'line-color': style?.color ? style.color : '#f2f8fc',
                        'line-opacity': 0.8,
                      },
                    }}
                  />
                }
              </Source>
            )}
            {(feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') && (
              <Source type="geojson" data={feature}>
                {
                  <Layer
                    {...{
                      id: `${feature.id}-line`,
                      type: 'line',
                      paint: {
                        'line-width': 4,
                        'line-color': style?.color ? style.color : '#f2f8fc',
                        'line-opacity': 0.8,
                      },
                    }}
                  />
                }
                {
                  <Layer
                    {...{
                      id: `${feature.id}-fill`,
                      type: 'fill',
                      paint: {
                        'fill-color': style?.fillColor
                          ? style.fillColor
                          : style?.color
                            ? style.color
                            : '#00b8ff',
                        'fill-opacity': 0.2,
                      },
                    }}
                  />
                }
              </Source>
            )}
            <Pointer
              title={title}
              feature={feature}
              center={center}
              onClickMarker={onClickMarker}
              zIndex={zIndex}
              style={style}
              index={index}
              printMode={printMode}
              isProduction={isProduction}
            >
              {printMode ? (
                index + 1
              ) : (
                <Icon emoji={style?.emoji} backgroundColor={false} iconColor="black" height="auto" />
              )}
            </Pointer>
          </Fragment>
        );
      })}
    </>
  );
};
