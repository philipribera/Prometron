import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { withFirebase } from "../Firebase";

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
      dbCoords: null,
      nearbyPlayerCoords: {}
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
        console.log(JSON.parse(JSON.stringify(userPosition)));
        this.setState({ dbCoords: userPosition });
      });
  };

  getNearbyPlayerPosition = () => {
    this.props.firebase.users()
      .on("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          let data = childSnapshot.val();
          if (key === this.props.userId) {
            return true;
          };
          this.state.nearbyPlayerCoords[key] = data.position;


          // if (this.state.nearbyPlayerCoords === null) {
            // this.setState({nearbyPlayerCoords: {[key]: data.position}}.)
            // console.log(key)
            // console.log(this.state.nearbyPlayerCoords.key)
          // } else {
            // this.setState(prevState => ({
            //   nearbyPlayerCoords: prevState.nearbyPlayerCoords[key] = data.position
            // }));
            // this.setState(prevState, {nearbyPlayerCoords: {[key]: data.position}})
          // }
          // this.state.nearbyPlayerCoords.push({[key]: data.position});
        });
      });
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
    this.getNearbyPlayerPosition();
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
    for (let key in this.state.nearbyPlayerCoords) {
      var obj = this.state.nearbyPlayerCoords[key];
      markers.push([obj.latitude, obj.longitude])
      console.log(obj.latitude)
    }
    // this.state.nearbyPlayerCoords.forEach(player => {
    //   console.log(player.latitude)
    //   markers.push({ ...player })
    // });
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
            <Marker key={index} position={Object.values(marker)}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ))}
        </Map>
        );
        export default withFirebase(LocatedTwo);
