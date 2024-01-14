import { load } from 'js-yaml';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import osmtogeojson from 'osmtogeojson';
import { basename, parse } from 'path';
import { FeatureCollection } from 'geojson';

const config = load(readFileSync('overpass.yml', 'utf8')) as any;

const convertOverpassTag = (nwr: any) => {
  return nwr
    .map((nwr: any) => {
      return Object.keys(nwr).map((key) => {
        if (nwr[key]) {
          return `${key}="${nwr[key]}"`;
        } else {
          return key;
        }
      });
    })
    .flat();
};

const convertOverpassNWRQuery = (subject: string, tags: string[]) => {
  return tags.map((tag: string) => {
    return `${subject}[${tag}](area.a)`;
  });
};

const areaKey = Object.keys(config.area)[0];
const areaValue = config.area[areaKey];

for await (const layer of config.layers) {
  let subject = '';
  let tags = [];
  let nwrQuery: string[][] = [];
  let nwrQueries: string = '';
  let osmIds: string[] = [];
  let osmIdsQuery: string = '';
  let osmOverrideFeatures: any[] = [];

  if (layer.name !== 'road_closed') {
    continue;
  }

  if (layer.nwr) {
    subject = 'nwr';
    tags = convertOverpassTag(layer.nwr);
    nwrQuery.push(convertOverpassNWRQuery(subject, tags));
  }
  if (layer.node) {
    subject = 'node';
    tags = convertOverpassTag(layer.node);
    nwrQuery.push(convertOverpassNWRQuery(subject, tags));
  }
  if (layer.way) {
    subject = 'way';
    tags = convertOverpassTag(layer.way);
    nwrQuery.push(convertOverpassNWRQuery(subject, tags));
  }
  if (layer.relation) {
    subject = 'relation';
    tags = convertOverpassTag(layer.relation);
    nwrQuery.push(convertOverpassNWRQuery(subject, tags));
  }
  if (layer.osm_ids_dir) {
    subject = 'nwr';
    const yamlFiles = glob.sync(`./${layer.osm_ids_dir}/**/[!_]*.yml`);
    if (yamlFiles.length > 0) {
      osmIds = yamlFiles.map((yamlFile) => parse(basename(yamlFile)).name);
      osmIdsQuery = `nwr(id:${osmIds.join(',')})(area.a);`;
      yamlFiles.map((yamlFile) => {
        const osmOverrideFeatureJSON = load(readFileSync(yamlFile, 'utf8')) as any;
        osmOverrideFeatureJSON['id'] = parse(basename(yamlFile)).name;
        osmOverrideFeatures.push(osmOverrideFeatureJSON);
      });
    }
  }

  if (nwrQuery.length > 0) {
    nwrQueries = nwrQuery.flat().join(';\n      ') + ';';
  }

  if (nwrQueries.length === 0 && osmIdsQuery.length === 0) {
    continue;
  }

  const query = `
    [out:json][timeout:30000];
    area['${areaKey}'='${areaValue}']->.a;
    (
      ${nwrQueries}
      ${osmIdsQuery}
    );
    out geom;
  `;
  console.log(query);

  const geojsonFilePath = `public/data/GeoJSON/${layer.name}.geojson`;

  let geojson: FeatureCollection;
  if (existsSync(geojsonFilePath)) {
    geojson = JSON.parse(readFileSync(geojsonFilePath, 'utf-8'));
  } else {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });
    const json = await res.json();
    geojson = osmtogeojson(json);
  }

  if (osmOverrideFeatures.length > 0) {
    for (const feature of geojson.features) {
      for (const overrideFeature of osmOverrideFeatures) {
        if (feature.id && typeof feature.id === 'string' && feature.id.includes(overrideFeature.id)) {
          if (feature.properties) {
            Object.assign(feature.properties, overrideFeature.properties);
          }
        }
      }
    }
  }

  writeFileSync(geojsonFilePath, JSON.stringify(geojson, undefined, 2));
}
