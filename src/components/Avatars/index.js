import React, { Component } from "react";
import { withFirebase } from "../Firebase";
// Avatars
import AvTrumpo from "../../images/lillaTrumpo.jpg";
import AvGirl from "../../images/girlAv_300.png";
import AvDancer from "../../images/dancerAv_300.png";
import AvPinguin from "../../images/pinguinAv_300.png";
import AvBlue from "../../images/blueAv_300.png";

import Styled from 'styled-components';


/*** STYLED COMPONENTS ***/
const StyledForm = Styled.form`
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
      max-height: 230px;
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
/*** END ***/


class Avatars extends Component {
    constructor(props) {
        super(props);
        this.userId = null;
      }
    state = {
        avatar: "..."
    }

    changeAvatar = ev => {
        this.props.firebase.user(this.props.userId).child("avatar").set(ev.target.id);
    }

    render() {
        return (
            <article class="choose-avatar">
                <StyledAvatar>
                <figure>
                  <img src={AvTrumpo} alt="user avatar" />
                  <StyledStatus
                    backgroundColor={this.statusLight}
                  />
                </figure>
              </StyledAvatar>


                <h3 class="input-title">Choose your avatar</h3>
                <StyledForm onClick={ this.changeAvatar }>
                    <label>
                    <input type="radio" name="avatar" value="girl" id="girl" />
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
            </article >
        );
    }
}

export default withFirebase(Avatars);