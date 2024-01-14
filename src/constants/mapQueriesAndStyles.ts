export const hospitalsStyle = {
  color: 'rgb(0, 0, 0)',
  fillColor: 'rgb(255, 0, 0)',
  emoji: '🏥',
};

export const hospitalsQuery = `
[out:json][timeout:30000];
rel(4800240);
map_to_area->.a;
(
nwr["amenity"="hospital"](area.a);
);
out geom;
`;

export const schoolsStyle = {
  color: 'rgb(0, 0, 0)',
  fillColor: 'rgb(0, 255, 0)',
  emoji: '🏫',
};

export const schoolsQuery = `
[out:json][timeout:30000];
rel(4800240);
map_to_area->.a;
(
nwr["amenity"="school"](area.a);
);
out geom;
`;

export const overpassQueryWithStyleList = [
  {
    query: hospitalsQuery,
    style: hospitalsStyle,
  },
  {
    query: schoolsQuery,
    style: schoolsStyle,
  },
];
