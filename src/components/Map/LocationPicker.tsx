import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

export default function LocationPicker({
  onSelect,
}: {
  onSelect?: (loc: any) => void;
}) {
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 }); // Default location
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

  // Function to get address from coordinates
  const fetchAddress = async (lat: number, lng: number) => {
    console.log("Latitude:", lat, "Longitude:", lng);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      // Example: return city, state, country
      return {
        city:
          data.address.city || data.address.town || data.address.village || "",
        state: data.address.state || "",
        country: data.address.country || "",
        lat,
        lng,
      };
    } catch (err) {
      console.error("Error fetching address:", err);
      return { city: "", state: "", country: "", lat, lng };
    }
  };

  const MarkerHandler = () => {
    useMapEvents({
      click: async (e) => {
        const latlng = e.latlng;
        setPosition(latlng);
        const addr = await fetchAddress(latlng.lat, latlng.lng);
        setAddress(addr);
        onSelect && onSelect(addr); // Send address to parent
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
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <MarkerHandler />
      </MapContainer>
      {address.city && (
        <div style={{ marginTop: "10px" }}>
          Selected Location: {address.city}, {address.state}, {address.country}
        </div>
      )}
    </div>
  );
}
