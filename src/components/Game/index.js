import React, { Component } from "react";
//import GameMap from '../HomeMap';
import Styled from 'styled-components';
import HomeMap from "../HomeMap";
import Chat from '../Chat'


/*** STYLED COMPONENETS ***/
const StyledFlexContainer = Styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
    min-height: 492px;    
`;
const StyledMap = Styled.div`    
    flex-basis: 100%;
    border: 1px solid rgb(177,177,177);    
    border-top: 1px solid rgb(252,252,252);
`;
/*
const StyledChatWindowHd = Styled.div`
    display: none;
`;
*/
const StyledChatWindow = Styled.div`
    flex-basis: 100%;
    min-width: 332px;
    min-height: 292px;
    max-height: 500px;
    padding: 12px;
    margin-bottom: 32px;
    & h2 {
        color: rgb(29, 134, 226);
        text-shadow: 1px 1px 0.5px rgb(252,252,252);
        margin-bottom: 12px;
    }
    @media (max-width: 767px) {
        flex-basis: 100%;
        padding: 12px;
    }
`;
/*** END ***/


class Game extends Component {
    state = {
        gameID: null,
        userCoordinates: null,
        gameData: []
    };

    updatePosition = position => {
        this.setState({
            userCoordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        });
    };

    watchUserPosition = () => {
        this.watchId = navigator.geolocation.watchPosition(
            this.updatePosition,
            error => {
              console.log("error" + error);
            },
            {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0,
              distanceFilter: 1
            }
        );
    };


    componentDidMount(){
        this.watchUserPosition();
        this.gameListener();
    };

    render() {
        return (
            <StyledFlexContainer>

                <StyledMap className="map-container">
                    <gameMap />
                </StyledMap>

                    <div>
                        <button onClick={this.ShowChat}>Chat</button>
                    </div><br />
                    <StyledChatWindow id="chat-window">
                    <Chat />
                    </StyledChatWindow>
            </StyledFlexContainer>
        );
    }
}

export default Game;

