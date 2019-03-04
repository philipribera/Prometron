import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import AntPath from "react-leaflet-ant-path";

const styles = {
  height: "100%" 
}

const GameMap = props => {
    console.log(props.users)
    // if (props.users !== undefined) {
    //     const userMarkers = []
    //     const userUids = Object.keys(props.gameData.users);
    //     userUids.forEach(uid => {
    //         userMarkers.push(props.users[uid].path[props.users[uid].path.length - 1]);
    //     });
    // };

    return (
      <Map style={styles}
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