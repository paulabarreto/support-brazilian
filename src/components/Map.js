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
import AppBar from "./AppBar";

const GOOGLE_MAPS_API = process.env.REACT_APP_GOOGLE_API_KEY;

const containerStyle = {
  width: "100%",
  height: "88vh",
  marginTop: "70px"
};

const libraries = ["places"];
const url = urlService(endpoints.GetCoordinates);

export default function MyMapComponent() {
  const [center, setCenter] = useState({
    lat: parseFloat(43.661554), 
    lng: parseFloat(-79.368456)
  });


  const handleClickMapMenu = (index) => {
    if(index === 5) {
      findBrazilianBusiness();
    } else {
      centerOnCurrentPosition();
      setZoom(15)
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API,
    libraries: libraries,
  });

  const [map, setMap] = React.useState(null);
  const [zoom, setZoom] = React.useState(10);
  const [currentPosition, setCurrentPosition] = React.useState(null);

  const centerOnCurrentPosition = () => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setCenter({ lat, lng });
        setCurrentPosition({ lat, lng });
      }
    );
  }

  const onLoad = (map) => {
    centerOnCurrentPosition();
    setMap(map);
  };

  const findBrazilianBusiness = () => {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(({ lat, lng }) => bounds.extend({lat: parseFloat(lat), lng: parseFloat(lng)}));
    map.fitBounds(bounds);
  }

  const [markers, setMarkers] = React.useState([]);
  
  const getCoords = async () => {
    const coordinates = await getAllCoordinates(url);
    // Some api resp may not have coordinates
    const filtered = coordinates.length > 0 ? coordinates.filter((coord) => coord.lat && coord.adminApproved) : [];
    const markersWithSite = filtered.map(business => {
      return {
        ...business,
        site: business.website ? business.website : business.instagram
      }
    })
    setMarkers(markersWithSite);
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
    <div>
      <AppBar 
        map={true}
        defaultIndex={6}
        handleClickMapMenu={handleClickMapMenu}
      />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onClick={() => setActiveMarker(null)}
      >
        {markers.map(({ _id, name, site, location, lat, lng }) => (
          <Marker
            key={_id}
            position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
            onClick={() => handleActiveMarker(_id)}
          >
            {activeMarker === _id ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div>

                  <a target="_blank" rel="noreferrer" href={site}><div>{name}</div></a>
                  <div>{location}</div>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        ))}
        <Marker
          position={currentPosition}
          // icon={<LocationSearchingIcon/>}
        >
          <InfoWindow onCloseClick={() => setActiveMarker(null)}>
            <div>You're here</div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    </div>
  ) : (
    <div>Loading</div>
  );
}

