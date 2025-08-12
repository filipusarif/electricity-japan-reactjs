import { useMapEvents } from "react-leaflet";
import { getFeatureCenter } from "../../../utils/mapUtils";

interface Props {
  selectedRegion: any | null;
  hoveredRegion: string | null;
  geoData: any;
  setPopupPosition: (pos: { x: number; y: number } | null) => void;
  setHoverPos: (pos: { x: number; y: number } | null) => void;
}

export default function MapEventHandler({
  selectedRegion,
  hoveredRegion,
  geoData,
  setPopupPosition,
  setHoverPos
}: Props) {
  const map = useMapEvents({
    move: () => {
      if (selectedRegion) {
        const center = getFeatureCenter(selectedRegion);
        const point = map.latLngToContainerPoint(center);
        setPopupPosition({ x: point.x, y: point.y });
      }
      if (hoveredRegion && geoData) {
        const hoverFeature = geoData.features.find(
          (f: any) => f.properties.name === hoveredRegion
        );
        if (hoverFeature) {
          const center = getFeatureCenter(hoverFeature);
          const point = map.latLngToContainerPoint(center);
          setHoverPos({ x: point.x, y: point.y });
        }
      }
    },
    zoomend: () => {
      if (selectedRegion) {
        const center = getFeatureCenter(selectedRegion);
        const point = map.latLngToContainerPoint(center);
        setPopupPosition({ x: point.x, y: point.y });
      }
      if (hoveredRegion && geoData) {
        const hoverFeature = geoData.features.find(
          (f: any) => f.properties.name === hoveredRegion
        );
        if (hoverFeature) {
          const center = getFeatureCenter(hoverFeature);
          const point = map.latLngToContainerPoint(center);
          setHoverPos({ x: point.x, y: point.y });
        }
      }
    }
  });

  return null;
}
