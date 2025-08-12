export {};

declare global {
  interface Window {
    mapInstance?: import('leaflet').Map; // atau any jika gak mau repot
  }
}