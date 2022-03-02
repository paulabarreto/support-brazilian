import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import 'dotenv/config'

const GOOGLE_MAPS_API = process.env.REACT_APP_GOOGLE_API_KEY;

const containerStyle = {
  width: '400px',
  height: '400px'
};

function MyMapComponent() {
  const [center, setCenter] = React.useState({
    lat: -3.745,
    lng: -38.523
  });
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API,
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


  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyMapComponent)