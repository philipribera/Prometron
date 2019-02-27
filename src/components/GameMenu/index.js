import React, { Component } from "react";
import Styled from 'styled-components';

/*** STYLED COMPONENETS ***/
const StyledFlexContainer = Styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
    min-height: 492px;
    background: rgb(47,47,47);  
    background: transparent;  
    color: rgb(237,237,237);  
    color: rgb(77,77,77);  
`;
const StyledMenu = Styled.div`
    width: 206px;	
	background-color: rgba(197,197,197, 0.7);	
	font-size: 1.5em;
	font-weight: 600;
	text-align: center;
	padding: 18px 10px 10px 10px;
	margin: 4% auto 0;	
	border: 2px solid rgba(197,197,197, 0.9);	
	border-radius: 4%;
`;
const StyledTitle = Styled.h1`    
    color: rgb(154,154,154);    
`;
const StyledGameButton = Styled.button`
    font-weight: 600;
    background-color: transparent;
    background-color: rgb(255,173,55);
    color: rgb(245, 145, 57);
    color: rgb(97,97,97);
    padding: 7px;
    margin-bottom: 12px;
    &:hover {   
        opacity: 0.9;     
`;
const StyledGameList = Styled.ul`
    flex-basis: 100%;
    text-align: center;
    padding: 22px;
`;

const StyledGameLi = Styled.li`
    list-style-type: none;
    cursor: pointer;
    padding: 6px;
    border: 1px solid rgb(144,144,144);
    &:hover {
        opacity: 0.8;
    }
`;

const StyledSetGame = Styled.div`
    padding: 22px;    
`;

const StyledSetSelect = Styled.div`
    position: relative;
    font-family: Arial;
    padding: 4px 0;
    & select {
        cursor: pointer;
        padding: 4px;
        margin: 12px;
        background-color: rgb(55,55,55);    
        color: rgb(247,247,247);
        border: 1px solid rgb(122,122,122);
}`;
const StyledSetLi = Styled.li`
    list-style-type: none;
    cursor: pointer;
    padding: 4px 0;    
`;
/*** END ***/


class GameMenu extends Component {
    state = {
        // Set up game state
        userInGame: false,

        parts: {
            ShowGames: false,
            ShowSetUpGame: false
        }
    }

/*
    switch (part) {
        case ("ShowSkills"):
          //this.smoothScroll("#skills", 2000);
          this.setState((prevState, props) => ({
            parts: {
              ...prevState.parts,
              ShowSkills: !prevState.parts.ShowSkills
            }
          }));
          break;
        case ("ShowProjects"):
          this.setState((prevState, props) => ({
            parts: {
              ...prevState.parts,
              ShowProjects: !prevState.parts.ShowProjects
            }
          }));
          break;
        case ("ShowAbout"):
          this.setState((prevState, props) => ({
            parts: {
              ...prevState.parts,
              ShowAbout: !prevState.parts.ShowAbout
            }
          }));
          break;
        }
    */

    render() {
        return (
            <StyledFlexContainer>
                <StyledMenu>
                    <StyledTitle>
                        MENU
                </StyledTitle><br />
                    <StyledGameButton>
                        Join Game
                </StyledGameButton><br />
                    <StyledGameButton>
                        Create Game
                </StyledGameButton><br />
                </StyledMenu><br />

                <StyledGameList>
                    <h3>GAMES IN PROGRESS</h3><br />
                    <StyledGameLi>Pinguin Game</StyledGameLi>
                </StyledGameList>

                <StyledSetGame>
                    <StyledSetSelect>
                        Game Area
                        <select>
                            <option value="Rad1"> Radius: 1 km</option>
                            <option value="Rad2"> Radius: 2 km</option>
                            <option value="Rad3"> Radius: 3 km</option>
                            <option value="Rad4"> Radius: 4 km</option>
                        </select>
                    </StyledSetSelect>
                    <StyledSetSelect>
                        Set Game Time
                        <select>
                            <option value="Time1h"> 1 Hour</option>
                            <option value="Time1h"> 2 Hour</option>
                            <option value="Time1h"> 3 Hour</option>
                            <option value="Time1h"> 4 Hour</option>
                            <option value="Time1h"> 5 Hour</option>
                        </select>
                    </StyledSetSelect>
                    <StyledSetLi>Password for your game <input type="text" />
                        <i class="fas fa-check"></i>
                    </StyledSetLi>
                </StyledSetGame><br />
            </StyledFlexContainer>
        );
    }
}

export default GameMenu;

