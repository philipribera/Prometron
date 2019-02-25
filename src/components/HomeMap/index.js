import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { withFirebase } from "../Firebase";

import Styled from 'styled-components';
import { auth } from "firebase";


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
      dbCoords: null,
      onlineUsersCoords: []
    };
  }

  calculateDistance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km (change this constant to get miles)
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return Math.round(d * 1000);
  };

  updatePosition = position => {
    this.setState({
      browserCoords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    });
    if (position.coords && this.state.dbCoords) {
      // Destructuring with renames
      const { latitude: lat1, longitude: lng1 } = position.coords;
      const { latitude: lat2, longitude: lng2 } = this.state.dbCoords;
      const dist = this.calculateDistance(lat1, lng1, lat2, lng2);
      if (dist > 1) {
        this.writeUserPositionToDB(position.coords);
      }
    }
  };

  getUserPositionFromDB = () => {
    this.props.firebase
      .user(this.props.userId)
      .child("position")
      .once("value", snapshot => {
        const userPosition = snapshot.val();
        this.setState({ dbCoords: userPosition });
      });
  };

  getOnlineUsers = () => {
    this.props.firebase.presencesRef()
      .on("value", snapshot => {
        let onlineUsers = snapshot.val();
        let userArray = Object.keys(onlineUsers);
        this.getUsersCoords(userArray);
      });
    };
    
  getUsersCoords = (userArray) => {
    let onlineUsersCoords = {};
    userArray.forEach(uid => 
      this.props.firebase.user(uid).once("value", snapshot => {
        if (uid === this.props.userId) {
          return
        };
        let data = snapshot.val();
        onlineUsersCoords[uid] = data.position;
        if (this.calculateDistance(this.state.browserCoords.latitude, this.state.browserCoords.longitude, data.position.latitude, data.position.longitude) < 1000) {
            this.setState({onlineUsersCoords: onlineUsersCoords})
            this.updateUsersCoords();
        };
      })
    );
  };
      
  updateUsersCoords = () => {
    console.log(Object.keys(this.state.onlineUsersCoords))
    Object.keys(this.state.onlineUsersCoords).forEach(uid =>
      this.props.firebase.user(uid).on("value", snapshot => {
        if (uid in this.state.onlineUsersCoords) {
          let data = snapshot.val();
          const onlineUsersCoords = Object.assign(this.state.onlineUsersCoords, { [uid]: data.position});
          this.setState({onlineUsersCoords: onlineUsersCoords});
        };
      }));
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
    this.getOnlineUsers();
    this.getUserPositionFromDB();
    this.watchId = navigator.geolocation.watchPosition(
      this.updatePosition,
      // might need to be in state
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
    }
    
    render() {
      const markers = [];
      markers.push({ ...this.state.browserCoords });
      Object.keys(this.state.onlineUsersCoords).forEach(uid => {
        markers.push({ ...this.state.onlineUsersCoords[uid], uid })
      });

      return (
        <div>
      {this.state.browserCoords ? (
        <MyMap
          markers={markers}
          position={Object.values(this.state.browserCoords)}
          zoom={13}
        />
      ) : null}
      <StyledPosDiv className="positition-info">
        <StyledCoords className="coordsBrowser">
          <p>Coords from Browser</p>
          <Coords position={this.state.browserCoords} />
        </StyledCoords>
        <StyledCoords className="coordsDB">
          <p>Coords from DB</p>
          <Coords position={this.state.dbCoords} />
        </StyledCoords>
      </StyledPosDiv>
      </div>
      );
    }
  }
  
  const Coords = props => (
    <div>
      {props.position ? (
        <div>
          <div>{props.position.latitude}</div>
          <div>{props.position.longitude}</div>
        </div>
      ) : null}
    </div>
    );

  const markerClickHandler = (uid) => {
    console.log(uid)
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
      {props.markers.map((marker, index) => (
        <Marker key={index} position={Object.values(marker)} onclick={markerClickHandler()}>
        </Marker>
      ))}
    </Map>
  );

export default withFirebase(LocatedTwo);