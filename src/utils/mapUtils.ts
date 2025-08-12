export const colors = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF",
  "#00FFFF", "#FFA500", "#800080", "#00FF7F", "#FF1493"
];

export const style = (
  feature: any,
  mapping: Record<string, string>,
  wilayahBesar: string[]
) => {
  const wilayah = mapping[feature.properties.name];
  const index = wilayahBesar.indexOf(wilayah);
  return {
    fillColor: colors[index % colors.length],
    weight: 1,
    opacity: 1,
    color: "#8e8e8e",
    dashArray: "1",
    fillOpacity: 0.7
  };
};

export const getFeatureCenter = (feature: any) => {
  let coords;
  if (feature.geometry.type === "Polygon") {
    coords = feature.geometry.coordinates[0];
  } else if (feature.geometry.type === "MultiPolygon") {
    coords = feature.geometry.coordinates[0][0];
  } else {
    return { lat: 0, lng: 0 };
  }

  const latSum = coords.reduce((acc: number, c: any) => acc + c[1], 0);
  const lngSum = coords.reduce((acc: number, c: any) => acc + c[0], 0);
  return {
    lat: latSum / coords.length,
    lng: lngSum / coords.length
  };
};
