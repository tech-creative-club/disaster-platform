'use client';

export const runtime = 'edge';

import { useSearchParams, useRouter } from 'next/navigation';
import { Map, GeolocateControl, NavigationControl, LngLatBounds } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { getOverpassResponseJsonWithCache } from '@/utils/getOverpassResponse';
import { useEffect, useState } from 'react';
import osmtogeojson from 'osmtogeojson';
import { Md5 } from 'ts-md5';
import { GeoJsonWithStyle } from '@/types/geojson';
import { overpassQueryWithStyleList } from '@/constants/mapQueriesAndStyles';
import { GeoJsonToSomethings } from '@/components/GeoJsonToSomethings';
import GeoJsonFeatureList from '@/components/GeoJsonFeatureList';
import CopyRights from '@/components/CopyRights';
import { exampleGeoJson } from '@/constants/exampleGeoJson';
import { Switch } from '@mui/material';
import DevelopmentMenu from '@/components/DevelopmentMenu';

// @ts-ignore
import * as turf from '@turf/turf';

export default function Page({ params }: { params: { map?: string } }) {
  // 建物の種類を指定しているが、IDが指定されていない場合にリダイレクトさせる
  const router = useRouter();
  if (params.map?.[0] && !params.map?.[1]) router.push('/');

  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const printMode = searchParamsString === 'print=true';

  const [isProduction, setIsProduction] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);
  const [currentBounds, setCurrentBounds] = useState<LngLatBounds>();

  const [geoJsonWithStyleList, setGeoJsonWithStyleList] = useState<Array<GeoJsonWithStyle>>([]);

  const [geoJsonWithStyleListInMapBounds, setGeoJsonWithStyleListInMapBounds] = useState<
    Array<GeoJsonWithStyle>
  >([]);

  //   print mode
  const [mapPrintMode, setMapPrintMode] = useState<boolean>(false);

  function handleSwitchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMapPrintMode(e.target.checked);
  }

  useEffect(() => {
    const thisEffect = async () => {
      setLoaded(true);
      for (const overpassQueryWithStyle of overpassQueryWithStyleList) {
        const overpassResJson = await getOverpassResponseJsonWithCache(overpassQueryWithStyle.query);
        const newGeojson = osmtogeojson(overpassResJson);
        const md5 = new Md5();
        md5.appendStr(overpassQueryWithStyle.query);
        const hash = md5.end();
        setGeoJsonWithStyleList((prev) => {
          if (prev.find((item) => item.id === hash)) return prev;
          return [
            ...prev,
            {
              id: hash as string,
              style: overpassQueryWithStyle.style || {},
              geojson: newGeojson,
            },
          ];
        });
      }
    };
    if (!loaded) {
      setLoaded(true);
      thisEffect();
    }
    setIsProduction(process.env.NODE_ENV === 'production');
  }, [loaded]);

  useEffect(() => {
    if (!geoJsonWithStyleList) return;
    if (!currentBounds) return;

    if (isProduction) {
      setGeoJsonWithStyleListInMapBounds(
        geoJsonWithStyleList.map((geoJsonWithStyle) => {
          // currentBounds is a LngLatBounds object
          // bbox extent in minX, minY, maxX, maxY order
          // convert currentBounds to bbox array
          const currentMapBbox = [
            currentBounds.getWest(),
            currentBounds.getSouth(),
            currentBounds.getEast(),
            currentBounds.getNorth(),
          ];

          const geojsonInMapBounds = geoJsonWithStyle.geojson.features.filter((feature) => {
            // use turf.js to check if feature is in map bounds
            const poly = turf.bboxPolygon(currentMapBbox);
            const isInside = turf.booleanContains(poly, feature);
            return isInside;
          });

          return {
            ...geoJsonWithStyle,
            geojson: {
              type: 'FeatureCollection',
              features: geojsonInMapBounds,
            },
          };
        })
      );
    } else {
      setGeoJsonWithStyleListInMapBounds(
        exampleGeoJson.map((geoJsonWithStyle) => {
          // 現在のマップのバウンズを取得
          const currentMapBbox = [
            currentBounds.getWest(),
            currentBounds.getSouth(),
            currentBounds.getEast(),
            currentBounds.getNorth(),
          ];

          const geojsonInMapBounds = geoJsonWithStyle.geojson.features.filter((feature) => {
            // use turf.js to check if feature is in map bounds
            const poly = turf.bboxPolygon(currentMapBbox);
            const isInside = turf.booleanContains(poly, feature);
            return isInside;
          });

          return {
            ...geoJsonWithStyle,
            geojson: {
              type: 'FeatureCollection',
              features: geojsonInMapBounds,
            },
          };
        })
      );
    }
  }, [geoJsonWithStyleList, currentBounds, isProduction]);

  return (
    <div className="flex h-screen w-screen flex-col sm:flex-row-reverse">
      <div className="relative h-3/5 flex-1 overflow-hidden sm:h-screen print:h-full">
        <Map
          initialViewState={{
            longitude: 137.1083671,
            latitude: 37.3294213,
            zoom: 9,
          }}
          hash={true}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json"
          attributionControl={false}
          onLoad={(e) => {
            setCurrentBounds(e.target.getBounds());
          }}
          onMove={(e) => {
            setCurrentBounds(e.target.getBounds());
          }}
        >
          {!printMode && (
            <>
              <GeolocateControl position="top-right" />
              <NavigationControl
                position="top-right"
                visualizePitch={true}
                showZoom={true}
                showCompass={true}
              />
            </>
          )}
          {geoJsonWithStyleListInMapBounds?.map((geoJsonWithStyle) => {
            return (
              <GeoJsonToSomethings
                key={geoJsonWithStyle.id}
                geojson={geoJsonWithStyle.geojson}
                style={geoJsonWithStyle.style}
                printMode={mapPrintMode}
                isProduction={isProduction}
              />
            );
          })}
        </Map>
        <CopyRights />
        {!isProduction && <DevelopmentMenu />}
      </div>
      <div className="relative flex h-2/5 max-w-full flex-col overflow-hidden sm:h-full sm:w-4/12 sm:max-w-sm">
        <ul className="block list-none overflow-scroll py-4">
          <div className="flex pl-5">
            <span className="flex items-center pr-2">プリントモードをオンにする</span>
            <Switch
              checked={mapPrintMode}
              onChange={handleSwitchChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
          {geoJsonWithStyleListInMapBounds?.map((geoJsonWithStyle, geoIndex) => {
            const emoji = geoJsonWithStyle.style?.emoji;
            return geoJsonWithStyle.geojson.features.map((feature, index) => {
              return (
                <GeoJsonFeatureList
                  key={feature.id}
                  emoji={emoji}
                  feature={feature}
                  index={index}
                  geoIndex={geoIndex}
                  length={geoJsonWithStyle.geojson.features.length}
                />
              );
            });
          })}
        </ul>
      </div>
    </div>
  );
}
