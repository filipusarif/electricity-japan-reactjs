import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapAnimation() {
  const map = useMap();

  useEffect(() => {
    map.setView([36.2048, 138.2529], 3);

    const timeout = setTimeout(() => {
      map.flyTo([36.2048, 138.2529], 5, { duration: 2 });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [map]);

  return null;
}

export default MapAnimation;
