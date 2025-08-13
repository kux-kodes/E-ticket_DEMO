import React from 'react';
import Map from 'react-map-gl';
import { Marker } from 'react-map-gl';

const MapComponent = ({ coordinates }) => {
  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      initialViewState={{
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        zoom: 14,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <Marker longitude={coordinates.lng} latitude={coordinates.lat} />
    </Map>
  );
};

export default MapComponent;