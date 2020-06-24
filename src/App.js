
import React, { useState, useEffect, useRef } from 'react';
import { Map, Popup, TileLayer, GeoJSON, CircleMarker, LayersControl, LayerGroup } from "react-leaflet";
import * as d3 from 'd3';
import "./App.css";


import Legend from './components/Legend';
import getColor from './utils/getColor';

const { BaseLayer, Overlay } = LayersControl;
const userName = process.env.REACT_APP_USER_NAME;
const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

const mapTypes = [
  { id: 'streets-v11', name: 'Map.Streets', checked: true },
  { id: 'outdoors-v11', name: 'Map.Outdoors', checked: false },
  { id: 'light-v10', name: 'Map.Light', checked: false },
  { id: 'dark-v10', name: 'Map.Dark', checked: false },
  { id: 'satellite-v9', name: 'Satellite.Light', checked: false },
  { id: 'satellite-streets-v11', name: 'Satellite.Streets', checked: false }
];

const geoJSONStyle = {
  color: 'red',
  weight: 2,
  fillOpacity: 0.1,
  fillColor: 'red',
}

function App() {

  const map = useRef()
  const [activeMarker, setActiveMarker] = useState(null);
  const [tectonicPlates, setTectonicPlates] = useState(null);
  const [earthquakes, setEearthQuakes] = useState(null);

  useEffect(() => {
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
      .then((data) => setTectonicPlates(data.features))
  }, [])

  useEffect(() => {
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
      .then((data) => setEearthQuakes(data.features))
  }, [])


  return (
    <>
      {!earthquakes ?
        null
        :
        <Map center={[0, 0]} zoom={2.5} ref={map}>
          <LayersControl position='topright' collapsed={false}>
            {mapTypes.map((mapType, index) =>
              <BaseLayer key={index} name={mapType.name} checked={mapType.checked}>
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/${userName}/${mapType.id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
                  attribution='&copy; <a href="http://mapbox.com">Mapbox</a> contributors'
                />
              </BaseLayer>
            )}
            <Overlay name='Earthquakes' checked={true}>
              <LayerGroup>
                {earthquakes.map((earthquake, index) => (
                  <CircleMarker
                    key={index}
                    center={[
                      earthquake.geometry.coordinates[1],
                      earthquake.geometry.coordinates[0]
                    ]}
                    onClick={() => {
                      setActiveMarker(earthquake);
                    }}
                    radius={earthquake.properties.mag * 2}
                    color={getColor(earthquake.properties.mag)}
                    opacity={0.9}
                    fill={true}
                    stroke={true}
                    weight={2}
                  />
                ))}

                {activeMarker && (
                  <Popup
                    position={[
                      activeMarker.geometry.coordinates[1],
                      activeMarker.geometry.coordinates[0]
                    ]}
                    onClose={() => {
                      setActiveMarker(null);
                    }}
                  >
                    <div>
                      <h2>{activeMarker.properties.place}</h2>
                      <p>time: {new Date(activeMarker.properties.time).toUTCString()}</p>
                      <p>magnitude: {activeMarker.properties.mag}</p>
                      <p>longitude: {activeMarker.geometry.coordinates[0]}</p>
                      <p>latitude : {activeMarker.geometry.coordinates[1]}</p>
                      <p>depth : {activeMarker.geometry.coordinates[2]}km</p>
                    </div>
                  </Popup>
                )}
                <Legend />

              </LayerGroup>
            </Overlay>
            <Overlay name='Fault Lines' checked={true}>
              {tectonicPlates &&
                <GeoJSON
                  data={tectonicPlates}
                  style={geoJSONStyle}
                />
              }
            </Overlay>
          </LayersControl>

        </Map>
      }
    </>
  );
}

export default App;
