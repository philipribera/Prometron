import React from 'react';
import { withFirebase } from "../Firebase";

import AvGirl from "../../images/girlAv_300.png";
import AvDancer from "../../images/dancerAv_300.png";
import AvPenguin from "../../images/pinguinAv_300.png";
import AvBlue from "../../images/blueAv_300.png";

import Styled from 'styled-components';

const Wrapper = Styled.div`
    display: inline-block;
    height: 82px;
    width: 212px;    
`;

/*
const StyledAvatar = Styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;
    padding: 5px 5px;
    background-image: url(${props => props.avatar});
    background-size: cover;
    background-position: center;
    width: 70px;
    min-width: 70px;      
    min-height: 76.67px;
    & img {
        height: 100%;
        width: 100%;
        border: 2px solid rgb(254,254,254);
    }
`;
*/


const StyledPic = Styled.div`
    display: inline-block;
    width: 40%;
    height: inherit;
    min-width: 70px;
    padding: 0 5px;
    background-image: url(${props => props.avatar});
    background-size: cover;
    background-position: center;
`;
const StyledPicInfo = Styled.div`
    display: inline-block;
    width: 60%;
    min-width: 120px;
    padding-left: 10px;    
`;

const StyledStatus = Styled.div`
    position: absolute;
    background-color: ${props => props.backgroundColor};
    width: 19px; 
    height: 19px;
    border: 1px solid white;        
    border-radius: 50%;   
    z-index: 10;     
`;

const StyledCharData = Styled.div`
    color: rgb(251, 151, 0);
    text-shadow: 1px 1px 0.5px rgb(157,157,157);
    margin-bottom: 6px;
    p {
        text-shadow: none;
        margin: 0;
        font-size: 11px;
    }
`;

/*
const InfoWrapper = Styled.div`    
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
`;
*/

const ButtonContainer = Styled.div`
    display: flex;
    margin: 0 auto;
    margin-bottom: 4px;
    button {
        font-size: 12px;
        margin: 0;
        &:first-of-type {
            margin-right: 5px;
        }
    }
`;
    
class PopupFactory extends React.Component {
    state = {
        data: {
            username: "...",
            desription: "...",
            avatar: ""
        }
    };
    
    componentWillMount(){
        this.props.firebase.user(this.props.uid).once("value", snapshot => {
            const data = snapshot.val();
            this.setState({data});
        });
    };
    
    showStatus = () => {
        if (this.state.data.status === "Invisible") {
            this.statusLight = "rgb(169,169,169)";
        }
        else if(this.state.data.status === "Idle"){
            this.statusLight = "rgb(222, 216, 27)"
        }
        else if(this.state.data.status === "Do Not Disturb"){
            this.statusLight = "rgb(255,0,0)"
        } else {
            this.statusLight = "rgb(83, 205, 13)"
        };
    };
    
    showAvatar = () => {
        if (this.state.data.avatar === "girl") {
            this.avatar = AvGirl;
        }
        else if (this.state.data.avatar === "dancer") {
            this.avatar = AvDancer;
        }
        else if (this.state.data.avatar === "penguin") {
            this.avatar = AvPenguin;
        } 
        else if (this.state.data.avatar === "blue") {
            this.avatar = AvBlue;
        } else {
            // Enter empty img
            this.avatar = "";
        }
    } 
    
    render() {
        this.showAvatar();
        this.showStatus();
        return (
            <Wrapper>
                <StyledPic avatar={this.avatar}>
                    <StyledStatus backgroundColor={this.statusLight} />
                </StyledPic>
                <StyledPicInfo>
                    <StyledCharData>
                        <h2>{this.state.data.username}</h2>
                        <p><i>{this.state.data.description}</i></p>
                    </StyledCharData>

                    <ButtonContainer>
                        <button>Add</button>
                        <button>Message</button>
                    </ButtonContainer>
                </StyledPicInfo>
            </Wrapper>
        )
    }
}

export default withFirebase(PopupFactory);