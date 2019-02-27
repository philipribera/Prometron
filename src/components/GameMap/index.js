import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import AntPath from "react-leaflet-ant-path";


class GameMap extends Component {
    state = {
      browserCoords: {
        latitude: 1,
        longitude: 1,
      },
    };

  updatePosition = position => {
    this.setState({
      browserCoords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
    });
  };

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      this.updatePosition,
      error => {
        console.log("error" + error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,   // as long as we wait
        maximumAge: 0,    // always updated
        distanceFilter: 1   // stop updating until at least moved 1 meter
      }
    );
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  };

  render() {
    return (
      <Map
        zoomControl={true}
        scrollWheelZoom={true}
        center={[this.state.browserCoords.latitude, this.state.browserCoords.longitude]}
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
};

export default GameMap;