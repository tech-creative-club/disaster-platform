import PositionType from './PositionType';
import Icon from './Icon';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import ProvideInformationButton from './ProvideInformationButton';
import ProvideInformationDrawer, { type Content } from './ProvideInformationDrawer';
import { Feature, Geometry, GeoJsonProperties, Point } from 'geojson';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface GeoJsonFeatureListProps {
  emoji?: string;
  feature: Feature<Geometry, GeoJsonProperties> | undefined;
  index: number;
  geoIndex: number;
  length: number;
}

export default function GeoJsonFeatureList({
  emoji,
  feature,
  index,
  geoIndex,
  length,
}: GeoJsonFeatureListProps): React.JSX.Element {
  const [menuState, setMenuState] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const url = `${pathname}`;
    const parts = url.split('/').filter(Boolean);
    const amenity = parts[0];
    const id = parts[1];
    if (!feature?.properties?.amenity) return;
    if (feature.properties?.amenity === amenity && String(feature.id).includes(id)) {
      setExpanded(true);
    }
  }, [feature, pathname]);

  if (!emoji || !feature) return <p>Object is Null</p>;

  const name = feature.properties?.name;
  const address: string = feature.properties?.['KSJ2:AdminArea'] + ' ' + feature.properties?.['KSJ2:ADS'];
  const buildingIdString = String(feature.id);
  const buildingId = buildingIdString.substring(buildingIdString.lastIndexOf('/') + 1);

  // 情報提供フォームのオプション
  const option: Content = {
    shelterName: name,
    shelterId: String(feature.id),
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setMenuState(open);
  };

  const handle = () => {
    setExpanded(!expanded);
    if (feature.properties?.amenity) {
      window.history.pushState(
        null,
        '',
        '/' + feature.properties.amenity + '/' + buildingId + window.location.hash
      );
    }
  };

  return (
    <div key={name} className={`py-2 ${length !== index + 1 && 'border-b border-zinc-200'}`}>
      <ProvideInformationDrawer
        onClose={toggleDrawer(false)}
        onClick={toggleDrawer(false)}
        menuState={menuState}
        options={option}
      />
      <PositionType emoji={emoji} index={index} geoIndex={geoIndex} />
      <Accordion sx={{ boxShadow: 0 }} onClick={handle} expanded={expanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Grid item xs={3}>
            <Icon emoji={emoji} iconColor="white" />
          </Grid>
          <Grid item xs={9}>
            <span className="flex h-full items-center pl-3" style={{ fontWeight: 500 }}>{`${
              index + 1
            }. ${name}`}</span>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <div className="truncate">
            {typeof address !== 'undefined' && address !== 'undefined undefined' ? (
              <span className="truncate pt-0.5 text-sm font-normal text-zinc-400">
                {address ? address : '表示できません'}
              </span>
            ) : (
              <span className="truncate pt-0.5 text-sm font-normal text-zinc-400">
                表示するコンテンツがありません
              </span>
            )}
          </div>
          {/* 情報提供ボタン */}
          <div>
            <ProvideInformationButton onClick={toggleDrawer(true)} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
