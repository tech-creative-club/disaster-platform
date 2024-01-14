import { FeatureCollection } from 'geojson';

export type GeoJsonWithStyle = {
  id: string;
  style: {
    color?: string;
    fillColor?: string;
    emoji?: string;
  };
  geojson: FeatureCollection;
};

export type { FeatureCollection };
