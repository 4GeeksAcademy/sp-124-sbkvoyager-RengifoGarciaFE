import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const cityCoordinates = {
  madrid: [40.4168, -3.7038],
  barcelona: [41.3874, 2.1686],
  roma: [41.9028, 12.4964],
  milan: [45.4642, 9.19],
  budapest: [47.4979, 19.0402],
  sevilla: [37.3891, -5.9845],
  valencia: [39.4699, -0.3763],
};

export default function PostMap({ ubication }) {
  if (!ubication || !ubication.city) return null;

  const coords =
    cityCoordinates[ubication.city.toLowerCase()] || [40.4168, -3.7038];

  return (
    <div className="mt-4">
      <h4 className="mb-3">Mapa</h4>

      <MapContainer
        center={coords}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={coords}>
          <Popup>
            {ubication.city}, {ubication.country}
            <br />
            {ubication.street} {ubication.number}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}