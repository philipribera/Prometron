import React from 'react';
import { withFirebase } from "../Firebase";

import AvGirl from "../../images/girlAv_300.png";
import AvDancer from "../../images/dancerAv_300.png";
import AvPenguin from "../../images/pinguinAv_300.png";
import AvBlue from "../../images/blueAv_300.png";

import Styled from 'styled-components';

const Wrapper = Styled.div`
    display: flex;
    height: 80px;
    width: 200px;
`;

const StyledAvatar = Styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;
    padding: 5px 5px;
    background-image: url(${props => props.avatar});
    background-size: cover;
    width: 70px;
    min-width: 70px;      
    min-height: 76.67px;
    & img {
        height: 100%;
        width: 100%;
        border: 2px solid rgb(254,254,254);
    }
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
    padding-left: 10px;
    color: rgb(251, 151, 0);
    text-shadow: 1px 1px 0.5px rgb(57,57,57);
    p {
        text-shadow: none;
        margin: 0;
        font-size: 11px;
    }
`;

const InfoWrapper = Styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
`;

const ButtonContainer = Styled.div`
    display: flex;
    margin: 0 auto;
    button {
        font-size: 12px;
        margin: 0;
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
                <StyledAvatar avatar={this.avatar}>
                    <StyledStatus backgroundColor={this.statusLight} />
                </StyledAvatar>
                <InfoWrapper>
                    <StyledCharData>
                        <h2>{this.state.data.username}</h2>
                        <p><i>{this.state.data.description}</i></p>
                    </StyledCharData>

                    <ButtonContainer>
                        <button>Add</button>
                        <button>Message</button>
                    </ButtonContainer>
                </InfoWrapper>
            </Wrapper>
        )
    }
}

export default withFirebase(PopupFactory);