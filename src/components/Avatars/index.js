import React, { Component } from "react";
import { withFirebase } from "../Firebase";
// Avatars
//import AvTrumpo from "../../images/lillaTrumpo.jpg";
import UserNameChange from '../UsernameChange';
import AvGirl from "../../images/girlAv_300.png";
import AvDancer from "../../images/dancerAv_300.png";
import AvPenguin from "../../images/pinguinAv_300.png";
import AvBlue from "../../images/blueAv_300.png";
import Styled from "styled-components";
import ChangeDescriptionForm from "../DescriptionChange";

/*** STYLED COMPONENTS ***/
const StyledAvatarsList = Styled.div`
    display: none;
    padding: 4px 0;
    margin: 4px 0;
    & select {
      padding: 4px;
      background-color: rgb(55,55,55);    
      color: rgb(247,247,247);
      border: 1px solid rgb(252,252,252);
    }  
`;
const StyledAvatar = Styled.div`
    /*flex-basis: 14%;*/
    position: relative;   
    @media (max-width: 767px) {
      
    }
`;
const StyledFigure = Styled.figure`  
  & img {
    width: 210px;
    min-width: 210px;      
    min-height: 240px;
    background: mediumvioletred;
    padding: 4px 4px 0px 4px;
    margin-bottom: 12px;
    border: 2px solid rgb(254,254,254);
  }
`;
const StyledCharData = Styled.div`
    flex-basis: 44%;
    min-width: 282px;
    padding: 0 12px;
    & h2 {
      font-size: 1.85em;
      color: rgb(251, 151, 0);
      text-shadow: 1px 1px 0.5px rgb(57,57,57);
    }
    & i {
      margin-left: 8px;
      cursor: pointer; 
    }
    @media (max-width: 767px) {
      flex-basis: 50%;    
      padding: 0 10px;  
      margin-bottom: 72px;
    }
    @media (max-width: 492px) {
      flex-basis: 100%;      
    }
`;
const StyledNameTitle = Styled.h2`
  display: inline;
  margin-right: 22px;
`;
const StyledEditButton = Styled.button`
  background-color: rgb(247,247,247);
  color: rgb(97,97,97);
  border: 1px solid rgb(177,177,177);     
  &:hover {   
    color: rgb(17,17,17);
    border: 1px solid rgb(202,202,202);     
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
const SelectTitle = Styled.h4`
  color: rgb(99, 99, 99);
  margin-bottom: 4px;
`;
const StyledSpan = Styled.span`
  & p {
    display: inline-block;
    max-width: 230px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
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
      userData: {},
      edit: false
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

  // Change state to edit 
  // render usernamechange component
  changeDesc = () => {
    this.state.edit ? this.setState({ edit: false }) : this.setState({ edit: true });
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
      .set(ev.target.value);
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
          <StyledAvatar>
            <StyledFigure onClick={this.showAvatarList}>
              <img src={this.avatar} alt="user avatar" />
              <StyledStatus backgroundColor={this.statusLight} />
            </StyledFigure>
          </StyledAvatar>
        </section>

        <StyledCharData>

          <StyledNameTitle>{this.state.userData.username}</StyledNameTitle>
          <StyledEditButton onClick={this.showProfile}>Edit profile</StyledEditButton>
          <br />
          <br />

          {this.state.edit ? <ChangeDescriptionForm userId={this.props.userId} /> : <StyledSpan><p>{this.state.userData.description}</p></StyledSpan>}
          <i onClick={this.changeDesc} class="fas fa-pencil-alt"></i>
          <i class="fas fa-check"></i>
          <br />
          <br />

          <StyledSel id="status-ul" onClick={this.changeStatus}>
            <SelectTitle>Set your status</SelectTitle>
            <select id="status">
              <option value="Online">Online</option>
              <option value="Idle">Idle</option>
              <option value="Do Not Disturb">Do not disturb</option>
              <option value="Invisible">Invisible</option>
            </select>
            <br />
          </StyledSel>
          <StyledAvatarsList id="show-avatars" onClick={this.changeAvatar}>
            <SelectTitle>Choose Avatar</SelectTitle>
            <select id="avatar">
              <option value="girl">Girl</option>
              <option value="dancer">Travolta</option>
              <option value="blue">Blue</option>
              <option value="penguin">Penguin</option>
            </select>
            <br />
          </StyledAvatarsList>
        </StyledCharData>
      </React.Fragment>
    );
  }
}

export default withFirebase(Avatars);