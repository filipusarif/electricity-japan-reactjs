import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import MapAnimation from "../components/organism/MapAnimation";

export default function Home() {
  const [geoData, setGeoData] = useState<any>(null);

  const wilayahBesar = [
    "Hokkaidō",
    "Tohoku",
    "Tokyo",
    "Chubu",
    "Hokuriku",
    "Kansai",
    "Chugoku",
    "Shikoku",
    "Kyusyu",
    "Okinawa"
  ];

  // Mapping prefektur → wilayah besar
  const mapping: Record<string, string> = {
    "Hokkaidō": "Hokkaidō",
    "Aomori": "Tohoku",
    "Iwate": "Tohoku",
    "Miyagi": "Tohoku",
    "Akita": "Tohoku",
    "Yamagata": "Tohoku",
    "Fukushima": "Tohoku",
    "Tokyo": "Tokyo",
    "Chiba": "Tokyo",
    "Kanagawa": "Tokyo",
    "Saitama": "Tokyo",
    "Yamanashi": "Chubu",
    "Nagano": "Chubu",
    "Shizuoka": "Chubu",
    "Aichi": "Chubu",
    "Toyama": "Hokuriku",
    "Ishikawa": "Hokuriku",
    "Fukui": "Hokuriku",
    "Osaka": "Kansai",
    "Kyoto": "Kansai",
    "Hyogo": "Kansai",
    "Nara": "Kansai",
    "Wakayama": "Kansai",
    "Shiga": "Kansai",
    "Hiroshima": "Chugoku",
    "Okayama": "Chugoku",
    "Yamaguchi": "Chugoku",
    "Shimane": "Chugoku",
    "Tottori": "Chugoku",
    "Kagawa": "Shikoku",
    "Tokushima": "Shikoku",
    "Ehime": "Shikoku",
    "Kochi": "Shikoku",
    "Fukuoka": "Kyusyu",
    "Saga": "Kyusyu",
    "Nagasaki": "Kyusyu",
    "Kumamoto": "Kyusyu",
    "Oita": "Kyusyu",
    "Miyazaki": "Kyusyu",
    "Kagoshima": "Kyusyu",
    "Okinawa": "Okinawa"
  };

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

    const colors = [
    "#FF0000", // merah
    "#00FF00", // hijau neon
    "#0000FF", // biru
    "#FFFF00", // kuning
    "#FF00FF", // magenta
    "#00FFFF", // cyan
    "#FFA500", // oranye
    "#800080", // ungu
    "#00FF7F", // hijau terang
    "#FF1493"  // pink
    ];

    const style = (feature: any) => {
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


  const onEachFeature = (feature: any, layer: any) => {
    const wilayah = mapping[feature.properties.name];
    layer.bindPopup(
      `<strong>${wilayah}</strong><br>${feature.properties.name}`
    );
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[36.2048, 138.2529]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <MapAnimation />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
