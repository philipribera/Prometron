import React, { Component } from "react";
import { withFirebase } from "../Firebase";
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
const StyledBackToMenu = Styled.div`
    position: fixed; 
    left: 0; 
    top: 0; 	
    background-color: rgba(157,157,157, 0.7);
    border: 1px solid rgb(77,77,77);
    border-left: none;
    vertical-align: 2%;
    text-align: center;
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

// GAME LIST
const StyledListTitle = Styled.h2`
    font-family: 'Orbitron',sans-serif;
    color: rgb(102,102,102);
    text-shadow: 1px 1px 0.5px rgb(202,202,202);
`;
const StyledGameList = Styled.ul`
    flex-basis: 100%;
    text-align: center;
    padding: 22px;
`;
const StyledGameLi = Styled.li`
    width: 300px;
    background-color: rgb(17,17,17);
    color: rgb(255, 162, 19);
    font-weight: 600;
    list-style-type: none;
    cursor: pointer;
    padding: 6px;
    margin: 0 auto;
    border: 1px solid rgb(144,144,144);
    &:hover {
        opacity: 0.8;
    }
`;

// Set up game
const StyledSetGame = Styled.form`
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
const StyledIcon = Styled.i`
    margin-left: 4px;
    &:hover {
        color: rgb(102,102,102);
    }
`;
/*** END ***/

class GameMenu extends Component {
    state = {
        // Set up game state
        userInGame: false,

        parts: {
            showBack: false,
            showGameMenu: true,
            showGameList: false,
            showSetUpGame: false
        },

        currentGames: {
            // list of game id's
        },

        // Creategame-inputs goes in here
        createGame: {
            name: null,
            password: null,
            game_area: null,
            game_time: null,
        }
    };

    getGames = () => {
        //TODO
    };

    createGame = () => {
        //TODO
    };


    showParts = (e) => {
        let trg = e.target.id;

        this.setState({
            parts: {
                showGameMenu: false,
                showBack: true
            }
        })

        if (trg === "join-game") {
            this.setState({
                parts: {
                    showGameList: true,
                }
            })
            console.log(this.state);
        } else if (trg === "create-game") {
            this.setState({
                parts: {
                    showSetUpGame: true
                }
            })
            console.log(this.state);
        }
    }


    render() {
        return (
            <StyledFlexContainer>


                {this.state.parts.showGameMenu ?

                    <StyledMenu onClick={this.showParts}>
                        <StyledTitle>
                            MENU
                    </StyledTitle><br />
                        <StyledGameButton id="join-game">
                            Join Game
                    </StyledGameButton><br />
                        <StyledGameButton id="create-game">
                            Create Game
                </StyledGameButton><br />
                    </StyledMenu>
                    : null}

                {this.state.parts.showBack ?
                    <StyledBackToMenu>Back to Menu</StyledBackToMenu>
                    : null}

                {this.state.parts.showGameList ?
                    <StyledGameList>
                        <br />
                        <StyledListTitle>GAMES IN PROGRESS</StyledListTitle><br />
                        <StyledGameLi>Pinguin Game</StyledGameLi>
                        <StyledGameLi>Blue Game</StyledGameLi>
                        <StyledGameLi>Dancer Game</StyledGameLi>
                    </StyledGameList>
                    : null}

                {this.state.parts.showSetUpGame ?
                    <StyledSetGame onSubmit={this.createGame}>
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
                        <StyledSetLi>Give the game a name <input type="text" />
                            <StyledIcon className="fas fa-check"></StyledIcon>
                        </StyledSetLi><br />

                        <StyledSetLi>Password for your game <input type="text" />
                            <StyledIcon className="fas fa-check"></StyledIcon>
                        </StyledSetLi>
                        <br />
                        <button>Create Game</button>

                    </StyledSetGame>
                    : null}

            </StyledFlexContainer>
        );
    };
};

export default withFirebase(GameMenu);

