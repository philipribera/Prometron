import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import AntPath from "react-leaflet-ant-path";

const styles = {
  height: "100%"
}

const GameMap = props => {
  const userMarkers = []
  const userTrails = []
  const userUids = Object.keys(props.users);
  userUids.forEach(uid => {
    userMarkers.push(props.users[uid].path[props.users[uid].path.length - 1]);
    userTrails.push(props.users[uid].path)
  });

  const options = { color: "red", pulseColor: "#FFF", delay: 300 };

  return (
    <Map style={styles}
      zoomControl={true}
      scrollWheelZoom={true}
      center={props.userPosition}
      zoom={13}
    >


      {/* Loop through all ingame users - Display their marker and path */}
      {userTrails.map((positions, index) => (
        <AntPath key={index} positions={positions} options={options} />
      ))}

      {userMarkers.map((position, index) => (
        <Marker
          key={index} position={position}
        >
        </Marker>
      ))}

      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
    </Map>
  );
};

export default GameMap;