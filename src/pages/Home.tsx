import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { wilayahBesar, mapping } from "../constants/regions";
import { style, getFeatureCenter } from "../utils/mapUtils";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import MapAnimation from "../components/organism/MapAnimation";
import SaveMapInstance from "../components/atoms/saveMapsInstance";
import Tooltip from "../components/atoms/tooltip";
import Modal from "../components/molecules/modal";
import MapEventHandler from "../components/atoms/mapEventHandler";

export default function Home() {
  const [geoData, setGeoData] = useState<any>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    fetch("/jp.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = {
          ...data,
          features: data.features.filter((f: any) =>
            wilayahBesar.includes(mapping[f.properties.name])
          )
        };
        setGeoData(filtered);
      });
  }, []);

    

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: (e: any) => {
        setHoveredRegion(feature.properties.name);

        const map = e.target._map;
        const center = getFeatureCenter(feature);
        const point = map.latLngToContainerPoint(center);
        setHoverPos({ x: point.x, y: point.y });

        e.target.setStyle({
          weight: 3,
          color: "#666",
          fillOpacity: 0.9,
        });
      },
      mouseout: (e: any) => {
        setHoveredRegion(null);
        setHoverPos(null);
        geoData && layer.resetStyle(e.target);
      },
      click: (e: any) => {
        setSelectedRegion(feature);

        const map = e.target._map;
        const center = getFeatureCenter(feature);

        map.flyTo([center.lat, center.lng], 7, { duration: 1.5 });

        const point = map.latLngToContainerPoint(center);
        setPopupPosition({ x: point.x, y: point.y });
      }
    });
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Map container */}
      <MapContainer
        center={[36.2048, 138.2529]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && <GeoJSON data={geoData} style={feature => style(feature, mapping, wilayahBesar)} onEachFeature={onEachFeature} />}
        <SaveMapInstance />
        <MapEventHandler
          selectedRegion={selectedRegion}
          hoveredRegion={hoveredRegion}
          geoData={geoData}
          setPopupPosition={setPopupPosition}
          setHoverPos={setHoverPos}
        />
        <MapAnimation />
      </MapContainer>

      {/* Tooltip hover */}
      {hoveredRegion && hoverPos && (
        <Tooltip hoveredRegion={hoveredRegion} hoverPos={hoverPos} mapping={mapping} />
      )}

      {/* Popup modal */}
      {selectedRegion && popupPosition && (
        <Modal
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          popupPosition={popupPosition}
          mapping={mapping}
        />
      )}
    </div>
  );
}
