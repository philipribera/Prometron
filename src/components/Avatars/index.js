import React, { Component } from "react";
import { withFirebase } from "../Firebase";
// Avatars
import AvTrumpo from "../../images/lillaTrumpo.jpg";
import AvGirl from "../../images/girlAv_300.png";
import AvDancer from "../../images/dancerAv_300.png";
import AvPenguin from "../../images/pinguinAv_300.png";
import AvBlue from "../../images/blueAv_300.png";

import Styled from "styled-components";

/*** STYLED COMPONENTS ***/
const StyledForm = Styled.form`
    display: none;
    padding: 8px 0;
    & label {
        cursor: pointer;        
    }
    & input {
        padding: 2px;
	    margin: 6px 8px 6px 10px;
    }  
`;
const StyledAvatar = Styled.figure`
    flex-basis: 14%;
    position: relative;
    background: mediumvioletred;

    & img {
      width: 210px;
      min-width: 210px;      
      min-height: 240px;
      border: 2px solid rgb(254,254,254);
    }
    @media (max-width: 767px) {
      margin-bottom: 22px;
    }
`;
const StyledStatus = Styled.div`
    position: absolute;
    background-color: ${props => props.backgroundColor};
    top: 7%;
    left: 7%;
    width: 36px; 
    height: 36px;
    display: inline-block;
    border: 1px solid white;        
    border-radius: 50%;        
`;
/*
const StyledUl = Styled.ul`   
    display: none;
    & li {      
      display: inline;      
      cursor: pointer;
      color: rgb(56, 53, 52);
      text-shadow: 1px 1px 0.5px rgb(255,255,255);
      font-weight: 600;
      padding: 0 4px;
      margin-right: 6px;      
    }
    & li:hover {      
      color: rgb(15,15,15);
      text-shadow: 1px 1px 0.5px rgb(227,227,227);
    }
`;
*/
const StyledSel = Styled.div`
  position: relative;
  font-family: Arial;

  & select {
    padding: 4px;
    background-color: rgb(55,55,55);    
    color: rgb(247,247,247);
    border: 1px solid rgb(252,252,252);
  }   
`; 

const AvatarTitle = Styled.h3`
  color: rgb(255,255,255);
  text-shadow: 1px 1px 0.5px rgb(77,77,77);
  margin: 12px 0;
`;

const StyledCharData = Styled.div`
    flex-basis: 30%;
    padding: 12px;
    & h2 {
      font-size: 1.85em;
      color: rgb(251, 151, 0);
      text-shadow: 1px 1px 0.5px rgb(57,57,57);
    }
    @media (max-width: 767px) {
      flex-basis: 48%;      
      margin-bottom: 72px;
    }
    @media (max-width: 492px) {
      flex-basis: 100%;      
    }
`;
/*** END ***/

/*** HANDLES CHARACTER DATA AND ONLINE STATUS ***/
class Avatars extends Component {
  constructor(props) {
    super(props);

    this.userId = null;
    this.statusLight = "rgb(83, 205, 13)";
    this.state = {
      userData: {}
    };
  }

  fetchUserData = () => {
    this.props.firebase.user(this.props.userId).on("value", snapshot => {
      this.setState({ userData: snapshot.val() });
    });
  };

  // Displays status choices
  showStatusChoice = () => {
    let statUl = document.getElementById("status-ul");
    if (statUl.style.display === "block") {
      statUl.style.display = "none";
    } else {
      statUl.style.display = "block";
    }
  };

  // Write new status to DB
  changeStatus = ev => {
    this.props.firebase
      .user(this.props.userId)
      .child("status")
      .set(ev.target.value);
  };

  // Change the status light
  showStatus = () => {
    if (this.state.userData.status === "Invisible") {
      this.statusLight = "rgb(169,169,169)";
    } else if (this.state.userData.status === "Idle") {
      this.statusLight = "rgb(222, 216, 27)";
    } else if (this.state.userData.status === "Do Not Disturb") {
      this.statusLight = "rgb(255,0,0)";
    } else {
      this.statusLight = "rgb(83, 205, 13)";
    }
  };

  showProfile = () => {
    document.getElementById("show-profile").style.display = "block";
  };

  componentDidMount() {
    this.fetchUserData();
  }

  /*** SHOW AVATAR CHOICES ***/
  showAvatarList = () => {
    document.getElementById("show-avatars").style.display = "block";
  };

  // Write avatar to DB
  changeAvatar = ev => {
    this.props.firebase
      .user(this.props.userId)
      .child("avatar")
      .set(ev.target.id);
  };

  showAvatar = () => {
    if (this.state.userData.avatar === "girl") {
      this.avatar = AvGirl;
    } else if (this.state.userData.avatar === "dancer") {
      this.avatar = AvDancer;
    } else if (this.state.userData.avatar === "penguin") {
      this.avatar = AvPenguin;
    } else if (this.state.userData.avatar === "blue") {
      this.avatar = AvBlue;
    } else {
      // Enter empty img
      this.avatar = "";
    }
  };

  render() {
    this.showStatus();
    this.showAvatar();

    return (
      <React.Fragment>
        <section className="choose-avatar">
          <br />
          <StyledAvatar>
            <figure onClick={this.showAvatarList}>
              <img src={this.avatar} alt="user avatar" />
              <StyledStatus backgroundColor={this.statusLight} />
            </figure>
          </StyledAvatar>
        </section>

        <StyledCharData>
          <h2>{this.state.userData.username}</h2>
          <br />
          <p>
            <i>{this.state.userData.description}</i>
          </p>
          <br />
          <button onClick={this.showProfile}>Edit profile</button>
          <br />
          <br />

          <StyledSel id="status-ul" onClick={this.changeStatus}>
            <select id="race">
              <option value="Online">Online</option>
              <option value="Idle">Idle</option>
              <option value="Do Not Disturb">Do not disturb</option>
              <option value="Invisible">Invisible</option>
            </select>
            <br />
          </StyledSel>

          <StyledForm id="show-avatars" onClick={this.changeAvatar}>
            <AvatarTitle className="input-title">Choose your avatar</AvatarTitle>
            <label>
              <input
                type="radio"
                name="avatar"
                value="girl"
                id="girl"
                checked={this.state.userData.avatar === "girl" ? true : false}
              />
              Girl
            </label>
            <label>
              <input type="radio" name="avatar" value="dancer" id="dancer" />
              Dancer
            </label>
            <label>
              <input type="radio" name="avatar" value="blue" id="blue" />
              Blue
            </label>
            <label>
              <input type="radio" name="avatar" value="penguin" id="penguin" />
              Penguin
            </label>
          </StyledForm>
        </StyledCharData>
      </React.Fragment>
    );
  }
}

export default withFirebase(Avatars);
