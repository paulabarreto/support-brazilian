import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import 'dotenv/config'
import { Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API = process.env.REACT_APP_GOOGLE_API_KEY;

const containerStyle = {
  width: '400px',
  height: '400px'
};

const libraries = ["places"];


function MyMapComponent() {
  const [center, setCenter] = React.useState({
    lat: -3.745,
    lng: -38.523
  });
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API,
    libraries: libraries
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
          setCenter({ lat, lng })
        })
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const onLoadMarker = marker => {
    console.log('marker: ', marker)
  }


  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onUnmount={onUnmount}
        onLoad={onLoad}
      >
        <Marker
          onLoad={onLoadMarker}
          position={{lat: 44.0354852, lng: -79.48185459999999}}
        />
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyMapComponent)