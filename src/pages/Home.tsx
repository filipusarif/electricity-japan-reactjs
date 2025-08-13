import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import { wilayahBesar, mapping } from "../constants/regions";
import { style, getFeatureCenter } from "../utils/mapUtils";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
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
  const [search, setSearch] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const mapRef = useRef<any>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

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
        handleRegionSelect(feature, e.target._map);
      }
    });
  };

  const handleRegionSelect = (feature: any, map: any) => {
    setSelectedRegion(feature);
    const center = getFeatureCenter(feature);
    map.flyTo([center.lat, center.lng], 7, { duration: 1.5 });
    const point = map.latLngToContainerPoint(center);
    setPopupPosition({ x: point.x, y: point.y });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = geoData?.features.filter((f: any) =>
      f.properties.name.toLowerCase().includes(value.toLowerCase())
    ) || [];

    setSuggestions(filtered);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        handleSuggestionClick(suggestions[highlightIndex]);
      }
    }
  };

  const handleSuggestionClick = (feature: any) => {
    const map = mapRef.current;
    if (map) {
      handleRegionSelect(feature, map);
    }
    setSearch("");
    setSuggestions([]);
    setHighlightIndex(-1);
  };




  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Searchbar */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 1000,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
        paddingTop: "4px",
        paddingBottom: "4px",
        paddingInline: "7px",
        borderRadius: "8px",
      }}
      
      className="text-slate-800 w-[90%] md:w-[300px]">
        <input
          type="text"
          placeholder="Search Region ..."
          value={search}
          onChange={handleSearchChange}
          style={{
            width: "100%",
            padding: "6px",
            border: "none",
            outline: "none",
            background: "transparent"
          }}
          className="text-sm border border-gray-300"
          onKeyDown={handleKeyDown}
        />
        {suggestions.length > 0 && (
          <ul style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            background: "rgba(255,255,255,0.9)",
            borderRadius: "6px",
            marginTop: "4px",
            overflow: "hidden"
          }}>
            {suggestions.map((feature: any, i: number) => (
              <div
                key={`${feature.properties.name}-${i}`}
                className={`cursor-pointer text-sm ${i === highlightIndex ? "bg-slate-100" : ""}`}
                onClick={() => handleSuggestionClick(feature)}
              >
                {feature.properties.name}
              </div>
            ))}
          </ul>
        )}
      </div>


      {/* Map container */}
      <MapContainer
        center={[36.2048, 138.2529]}
        zoom={5}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && <GeoJSON data={geoData} style={feature => style(feature, mapping, wilayahBesar)} onEachFeature={onEachFeature} />}

        <ZoomControl position="bottomright" />
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
