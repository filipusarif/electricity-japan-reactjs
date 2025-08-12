import { useMap } from "react-leaflet";
import { useEffect } from "react";

function SaveMapInstance() {
  const map = useMap();
  useEffect(() => {
    window.mapInstance = map;
  }, [map]);
  return null;
}

export default SaveMapInstance;
