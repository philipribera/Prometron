import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { withFirebase } from "../Firebase";

import PopupFactory from "../PopupFactory";

import Styled from 'styled-components';

/*** STYLED COMPONENTS ***/
const StyledPosDiv = Styled.div` 
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  background-color: rgb(12,12,12);
  color: rgb(252,252,252);
  text-shadow: 1px 1px 0.5px rgb(72,72,72);
  padding: 8px;
`;
const StyledCoords = Styled.div`
  flex-basis: 50%;
`;

class LocatedTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      browserCoords: null,
    };
  };
       
    // When user moves >1m
  writeUserPositionToDB = position => {
    const { latitude, longitude } = position;
    
    this.props.firebase
    // User id - extremely important to get the right user
    .user(this.props.userId)
    // Position object
    .update({ position: { latitude: latitude, longitude: longitude } });
    //this.setState({ dbCoords: position });
    
    // to be sure the data is synced - might add error checking...
    this.getUserPositionFromDB();
  };
  
  // Should be activated as soon the user is logged in - almost as landing page...
  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      this.updatePosition,
      error => {
        console.log("error" + error);
      },
      {
        // higher accuracy takes more time to get
        enableHighAccuracy: true,
        timeout: 20000,   // as long as we wait
        maximumAge: 0,    // always updated
        distanceFilter: 1   // stop updating until at least moved 1 meter
      }
      );
    }
    // To stop following the user
    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchId);
      this.props.firebase.user(this.props.userId).off();
      const users = Object.keys(this.state.onlineUsersCoords);
      users.forEach(user => {
        this.props.firebase.user(user).off()
      });
    }
    
    render() {
      return (
        <div>
        {this.state.browserCoords ? (
            <MyMap
            position={Object.values(this.state.browserCoords)}
            zoom={13}
            />
        ) : null}
        </div>
      );
    };
  };
      
  // send all data of several user as props here
  const MyMap = props => (
    <Map
      zoomControl={false}
      scrollWheelZoom={false}
      center={props.position}
      zoom={props.zoom}
    >

      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {/* {props.markers.map((marker, index) => (
        <Marker key={index} position={Object.values(marker)}>
        </Marker>
      ))} */}
    </Map>
  );

export default withFirebase(LocatedTwo);