import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// ✅ Fix Leaflet marker icon issue
const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function LocationPicker({
  onSelect,
}: {
  onSelect?: (loc: any) => void;
}) {
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 }); // Default: New Delhi
  const [address, setAddress] = useState<{
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
  }>({
    city: "",
    state: "",
    country: "",
    lat: 28.6139,
    lng: 77.209,
  });

  // ✅ Use token from .env
  const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_TOKEN;

  // Fetch address from coordinates using LocationIQ Reverse Geocoding
  const fetchAddress = async (lat: number, lng: number) => {
    console.log("Latitude:", lat, "Longitude:", lng);
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      const addr = {
        city:
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.hamlet ||
          "",
        state: data.address.state || "",
        country: data.address.country || "",
        lat,
        lng,
      };

      console.log("📍 City:", addr.city, "| State:", addr.state);
      return addr;
    } catch (err) {
      console.error("Error fetching address:", err);
      return { city: "", state: "", country: "", lat, lng };
    }
  };

  // Map click and drag handlers
  const MarkerHandler = () => {
    useMapEvents({
      click: async (e) => {
        const latlng = e.latlng;
        setPosition(latlng);
        const addr = await fetchAddress(latlng.lat, latlng.lng);
        setAddress(addr);
        onSelect && onSelect(addr);
      },
    });

    return (
      <Marker
        draggable
        position={position}
        eventHandlers={{
          dragend: async (e) => {
            const marker = e.target;
            const pos = marker.getLatLng();
            setPosition(pos);
            const addr = await fetchAddress(pos.lat, pos.lng);
            setAddress(addr);
            onSelect && onSelect(addr);
          },
        }}
      />
    );
  };

  return (
    <div>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        {/* OpenStreetMap Tiles (free) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MarkerHandler />
      </MapContainer>

      {address.city && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Location:</strong> {address.city}, {address.state},{" "}
          {address.country}
        </div>
      )}
    </div>
  );
}
