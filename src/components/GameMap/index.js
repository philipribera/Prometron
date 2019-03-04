import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import AntPath from "react-leaflet-ant-path";

const GameMap = props => {
//   const users = Object.keys(props.gameData.users);

    return (
      <Map
        zoomControl={true}
        scrollWheelZoom={true}
        center={props.userPosition}
        zoom={13}
      >


      {/* Loop through all ingame users - Display their marker and path */}

      {/* <AntPath /> */}

      {/* {Object.keys(props.users).map(user => (
        <Marker
        position={props.users[user].path[props.users[user].path.length() - 1]}
        >
        </Marker>
      ))} */}
       
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      </Map>
    );
};

export default GameMap;