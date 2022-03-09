import React, { useEffect, useState } from "react";
import "dotenv/config";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import * as endpoints from "../endpoints";
import urlService from "../services/urls";
import { getAllCoordinates } from "../services/getBusiness";
const GOOGLE_MAPS_API = process.env.REACT_APP_GOOGLE_API_KEY;

const containerStyle = {
  width: "400px",
  height: "400px",
};

const libraries = ["places"];
const url = urlService(endpoints.GetCoordinates);

const markersTest = [
  {
    id: 1,
    name: "Chicago, Illinois",
    position: { lat: 41.881832, lng: -87.623177 },
  },
  {
    id: 2,
    name: "Denver, Colorado",
    position: { lat: 39.739235, lng: -104.99025 },
  },
  {
    id: 3,
    name: "Los Angeles, California",
    position: { lat: 34.052235, lng: -118.243683 },
  },
  {
    id: 4,
    name: "New York, New York",
    position: { lat: 40.712776, lng: -74.005974 },
  },
];

function MyMapComponent() {
  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API,
    libraries: libraries,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setCenter({ lat, lng });
      }
    );
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onLoadMarker = (marker) => {
    console.log("marker: ", marker);
  };

  const [markers, setMarkers] = React.useState([{ lat: 44.5, lng: -79.3 }]);

  const getCoords = async () => {
    const coordinates = await getAllCoordinates(url);
    const filtered = coordinates.filter((coord) => coord.lat);
    setMarkers(filtered);
  };

  useEffect(() => {
    getCoords();
  }, []);

  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      onUnmount={onUnmount}
      onLoad={onLoad}
    >
      {markers.map(({ id, lat, lng }) => (
        <Marker
          key={id}
          position={{ lat: lat, lng: lng }}
          onClick={() => handleActiveMarker(id)}
        >
          {activeMarker === id ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>name</div>
            </InfoWindow>
          ) : null}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyMapComponent);
