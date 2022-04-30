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
import { Link } from "react-router-dom";

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


  const handleClickExpand = (isExpandSelected) => {
      if(isExpandSelected) {
        centerOnCurrentPosition();
        setZoom(10)
      } else {
        findBrazilianBusiness()
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
  const [markersWithIncompleteAddress, setMarkersWithIncompleteAddress] = React.useState([]);
  
  const getCoords = async () => {
    const coordinates = await getAllCoordinates(url);
    // Some api resp may not have coordinates
    // TODO handle admin approved on the api
    const filtered = coordinates.length > 0 ?
                      coordinates.filter((coord) => coord.lat &&
                                                    coord.adminApproved &&
                                                    isAddressComplete(coord.location)
                                          ) : [];
    let markersWithSite = filtered.map(business => {
      return {
        ...business,
        site: business.website ? business.website : business.instagram
      }
    })
    const markersWithIncompleteAddress = coordinates.length > 0 ? coordinates.filter((coord) => coord.lat &&
                                                                      coord.adminApproved &&
                                                                     !isAddressComplete(coord.location))
                                                                     : []
    const listWithIncompleteAddress = createListWithIncompleteAddress(markersWithIncompleteAddress)
    setMarkers(markersWithSite);
    const newMarkers = createNewMarkers(listWithIncompleteAddress)
    setMarkersWithIncompleteAddress(newMarkers)
  };
  const createListWithIncompleteAddress = (markers) => {
    let locationObj = {};
    for(let i = 0; i < markers.length; i++) {
        locationObj[markers[i].location] = locationObj[markers[i].location] ? 
                                           [ ...locationObj[markers[i].location], markers[i]] : [markers[i]]
    }
    return locationObj
  }

  const isAddressComplete = (location) => {
    let firstWord = location.split(" ")[0]
    if(!isNaN(firstWord) && !isNaN(parseFloat(firstWord))) {
      return true
    }
    return false
  }

  useEffect(() => {
    getCoords();
  }, []);

  /** Create another markers array with array of names, ids, etc for
    for each location (lat, lng)
  */
 // TODO make original markers list arrays so I can have only one list
  const createNewMarkers = (list) => {
    let moreMarkers = []
    for (const city in list) {
      moreMarkers = [
        ...moreMarkers,
        {
          _ids: list[city].map(loc => loc._id),
          names: list[city].map(loc => loc.name),
          locations: list[city].map(loc => loc.location),
          sites: list[city].map(loc => loc.site),
          lat: list[city][0].lat,
          lng: list[city][0].lng
        }
      ]
    }
    return moreMarkers
  }

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
        handleClickExpand={handleClickExpand}
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
        {markersWithIncompleteAddress.map(({ _ids, names, sites, locations, lat, lng }) => (
          <Marker
            key={_ids[0]}
            position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
            onClick={() => handleActiveMarker(_ids[0])}
          >
            {activeMarker === _ids[0] ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>
                <Link to={`/${locations[0]}`}>
                  See full list for {locations[0]}
                </Link>
                <div>There are {names.length} businesses in this location,</div>
                <div>but we don't have their complete address</div>
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

