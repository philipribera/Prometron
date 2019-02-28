import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import AntPath from "react-leaflet-ant-path";

const GameMap = props => {
    return (
      <Map
        zoomControl={true}
        scrollWheelZoom={true}
        center={props.userCoordinates}
        zoom={13}
      >


      {/* Loop through all ingame users - Display their marker and path */}

      {/* <AntPath /> */}

      {/* <Marker
        position={[this.state.browserCoords.latitude, this.state.browserCoords.longitude]}
      >
      </Marker> */}

      
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      </Map>
    );
};

export default GameMap;