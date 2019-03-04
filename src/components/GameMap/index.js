import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import AntPath from "react-leaflet-ant-path";
import { AuthUserContext } from "../Session";


const styles = {
  height: "100%" 
}

const GameMap = props => {
    return (
      <Map style={styles}
        zoomControl={true}
        scrollWheelZoom={true}
        center={props.userPosition}
        zoom={13}
      >


      {/* Loop through all ingame users - Display their marker and path */}

      {/* <AntPath /> */}
      <Marker
        position={props.userPosition}
      >
      </Marker>

      
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      </Map>
    );
};

export default GameMap;