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
const StyledChat = Styled.section`
   
`;
const StyledInput = Styled.input`
    padding: 4px;
    margin: 4px 0;    
`;
const StyledTarea = Styled.textarea`
    max-height: 300px;
    max-width: 492px;
    @media (max-width: 767px) {
        max-width: 330px;
    }
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
        userInGame: false
    }

    ShowChat = () => {
        console.log("Hello from chat");
        let chatWin = document.getElementById('chat-window');
        chatWin.style.display = "inherit";
    }

    render() {
        return (
            <StyledFlexContainer>

                <StyledMap className="map-container">
                    <HomeMap />
                </StyledMap>

                <StyledChat>
                    <div>
                        <button onClick={this.ShowChat}>Chat</button>
                    </div><br />
                    <StyledChatWindow id="chat-window">
                    <Chat />
                    </StyledChatWindow>
                </StyledChat>
            </StyledFlexContainer>
        );
    }
}

export default Game;

