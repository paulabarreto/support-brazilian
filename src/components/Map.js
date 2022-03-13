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
  width: "900px",
  height: "400px",
};

const libraries = ["places"];
const url = urlService(endpoints.GetCoordinates);

export default function MyMapComponent() {
  const [center, setCenter] = useState({
    lat: parseFloat(43.661554), 
    lng: parseFloat(-79.368456)
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
    setMap(map);
  }, []);

  const onLoadMarker = marker => {
    console.log(marker)
  }

  const [markers, setMarkers] = React.useState([{ }]);
  
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
      zoom={15}
      onLoad={onLoad}
      onClick={() => setActiveMarker(null)}
    >
      {markers.map(({ id, name, lat, lng }) => (
        <Marker
          key={id}
          onLoad={onLoadMarker}
          position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
          onClick={() => handleActiveMarker(id)}
        >
          {activeMarker === id ? (
          <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>{name}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <div>Loading</div>
  );
}

