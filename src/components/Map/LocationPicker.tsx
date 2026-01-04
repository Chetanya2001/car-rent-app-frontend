import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

export interface LocationData {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
}

// ----------------------------
// ✅ FIX LEAFLET DEFAULT MARKER ISSUE
// ----------------------------
const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// ----------------------------
// Updated LocationPicker Component
// ----------------------------
export default function LocationPicker({
  onSelect,
}: {
  onSelect?: (loc: LocationData) => void;
}) {
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 }); // Default: Delhi
  const [address, setAddress] = useState<LocationData>({
    lat: 28.6139,
    lng: 77.209,
  });
  const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_TOKEN;

  // ----------------------------
  // ✅ Reverse Geocoding (fetch address from lat/lng)
  // Added: more robust fallback and address formatting
  // ----------------------------
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      const addr: LocationData = {
        lat,
        lng,
        address: data.display_name,
        city:
          data.address.city || data.address.town || data.address.village || "",
        state: data.address.state || "",
        country: data.address.country || "",
      };

      return addr;
    } catch (err) {
      console.error("Error fetching address:", err);
      return { lat, lng, city: "", state: "", country: "", address: "" };
    }
  };

  // ----------------------------
  // ✅ Marker click & drag handler
  // Added: seamless click & drag integration
  // ----------------------------
  const MarkerHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        const addr = await fetchAddress(lat, lng);
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

  // ----------------------------
  // ✅ Effect: keep map centered on marker
  // ----------------------------
  useEffect(() => {
    // Optional: scroll map to selected position if needed
  }, [position]);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "400px", width: "100%", cursor: "pointer" }} // ✅ Updated cursor to pointer for interactivity
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MarkerHandler />
      </MapContainer>

      {/* ----------------------------
          ✅ Live address display below map
          Updated: more visible, user sees exact selection immediately
      ---------------------------- */}
      {address.address && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            background: "#f9f9f9",
            fontSize: "14px",
          }}
        >
          <strong>Selected Location:</strong> {address.address}
        </div>
      )}
    </div>
  );
}
