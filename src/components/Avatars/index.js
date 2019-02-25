import React, { Component } from "react";
import { withFirebase } from "../Firebase";
// Avatars
import AvTrumpo from "../../images/lillaTrumpo.jpg";
import AvGirl from "../../images/girlAv_300.png";
import AvDancer from "../../images/dancerAv_300.png";
import AvPenguin from "../../images/pinguinAv_300.png";
import AvBlue from "../../images/blueAv_300.png";

import Styled from 'styled-components';


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
    & img {
      width: 210px;
      min-width: 210px;      
      min-height: 230px;
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
    right: 7%;
    width: 36px; 
    height: 36px;
    display: inline-block;
    border: 1px solid white;        
    border-radius: 50%;        
`;
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
const StyledCharData = Styled.div`
    flex-basis: 30%;
    padding: 12px;
    & h2 {
      font-size: 1.8em;
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

/*** NEW CLASS TO HANDLE CHARACTER DATA AND ONLINE STATUS ***/
class Avatars extends Component {
    constructor(props) {
      super(props);

      this.userId = null;
      this.statusLight="rgb(83, 205, 13)"
      
      this.state = {
        userData: {}   
      };
    }    

    fetchUserData = () => {
        this.props.firebase.user(this.props.userId).on("value", snapshot => {
            this.setState({userData: snapshot.val()})
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
      this.props.firebase.user(this.props.userId).child("status").set(ev.target.id)
    };
    
    // Change the status light
    showStatus = () => {

      if (this.state.userData.status === "Invisible") {
        this.statusLight = "rgb(169,169,169)";
        }
      else if(this.state.userData.status === "Idle"){
          this.statusLight = "rgb(222, 216, 27)"
      }
      else if(this.state.userData.status === "Do Not Disturb"){
        this.statusLight = "rgb(255,0,0)"
      } else {
        this.statusLight = "rgb(83, 205, 13)"
      };
    };
    
    showProfile = () => {
      document.getElementById("show-profile").style.display = "block";
    };
    
    componentDidMount(){
      this.fetchUserData();
    };

    /*** SHOW AVATAR CHOICES ***/
    showAvatarList = () => {
        document.getElementById("show-avatars").style.display = "block";
    };

    // Write avatar to DB
    changeAvatar = (ev) => {
        this.props.firebase.user(this.props.userId).child("avatar").set(ev.target.id);
    }

    showAvatar = () => {
        if (this.state.userData.avatar === "girl") {
            this.avatar = AvGirl;
        }
        else if (this.state.userData.avatar === "dancer") {
            this.avatar = AvDancer;
        }
        else if (this.state.userData.avatar === "penguin") {
            this.avatar = AvPenguin;
        } 
        else if (this.state.userData.avatar === "blue") {
            this.avatar = AvBlue;
        } else {
            // Enter empty img
            this.avatar = "";
        }
    } 


    render() {
        this.showStatus();
        this.showAvatar(); 

        return (
            <article className="choose-avatar">
                <StyledAvatar>
                    <figure onClick={this.showAvatarList}>
                        <img src={this.avatar} alt="user avatar" />
                        <StyledStatus
                            backgroundColor={this.statusLight}
                        />
                    </figure>
                </StyledAvatar>

                <StyledForm id="show-avatars" onClick={this.changeAvatar} >
                    <h3 className="input-title">Choose your avatar</h3>
                    <label>
                        <input type="radio" name="avatar" value="girl" id="girl" checked={this.state.userData.avatar === "girl" ? true : false } />
                        Girl
                    </label>
                    <label><input type="radio" name="avatar" value="dancer" id="dancer" />
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


                <StyledCharData>
                    <h2>{this.state.userData.username}</h2>
                    <br />
                    <p><i>{this.state.userData.description}</i></p>
                    <br />
                    <button onClick={this.showProfile}>Edit profile</button>
                    <br />

                    <button onClick={this.showStatusChoice}>Change status</button>

                    <StyledUl id="status-ul" onClick={this.changeStatus}>
                        <li id="Online">Online |</li>
                        <li id="Idle">Idle |</li>
                        <li id="Do Not Disturb">Do Not Disturb |</li>
                        <li id="Invisible">Invisible</li>
                    </StyledUl>

                </StyledCharData>

            </article >
        );
    }
}

export default withFirebase(Avatars);