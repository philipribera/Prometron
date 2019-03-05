import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { Link, Redirect } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";

import Styled from "styled-components";

/*** STYLED COMPONENETS ***/
const StyledFlexContainer = Styled.div`
    position: relative;
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
    height: fit-content;
	background-color: rgba(197,197,197, 0.7);	
	font-size: 1.5em;
	font-weight: 600;
	text-align: center;
	padding: 18px 10px 18px 10px;
	margin: 4% auto 0;	
	border: 2px solid rgba(197,197,197, 0.9);	
	border-radius: 4%;
`;

const StyledBackToMenu = Styled.div`
    position: absolute; 
    right: 0; 
    top: 0; 	        
    margin: 0 auto;
    cursor: pointer;
    background-color: rgba(255,255,255,1);
    padding: 4px;
    border: 1px solid rgb(77,77,77);    
    text-align: center;
`;

const StyledTitle = Styled.h1`   
    font-family: 'Orbitron',sans-serif; 
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
    }   
`;

// GAME LIST
const StyledListTitle = Styled.h2`
    font-family: 'Orbitron',sans-serif;
    font-size: 1.95em;
    font-weight: 600;
    color: rgb(102,102,102);    
    color: rgb(132, 132, 132);    
    text-shadow: 1px 1px 0.5px rgb(252,252,252);
    @media (max-width: 767px) {
        font-size: 1.8;
    }
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
const StyledCreateTitle = Styled.h2`
    font-family: 'Orbitron',sans-serif;
    font-size: 1.9em;
    font-weight: 600;    
    color: rgb(68, 109, 187);
    text-shadow: 1px 1px 0.5px rgb(252,252,252);
    @media (max-width: 767px) {
        font-size: 1.8;
    }
`;
const StyledSetSelect = Styled.div`
    position: relative;
    font-family: Arial;
    padding: 4px 0;
    & select {
        cursor: pointer;
        padding: 4px;
        margin: 8px;
        background-color: rgb(117,117,117);    
        color: rgb(247,247,247);
        border: 1px solid rgb(122,122,122);
}`;
const StyledSetLi = Styled.li`
    list-style-type: none;
    cursor: pointer;
    padding: 4px 0;   
    margin: 4px 0; 
`;
const StyledCreateGame = Styled.button`
    background-color: rgb(0, 78, 171);
    color: rgb(252,252,252);
`;
/*** END ***/

class GameMenu extends Component {
  state = {
    Redirect: false,
    parts: {
      showBack: false,
      showGameMenu: true,
      showGameList: false,
      showSetUpGame: false
    }
  };

  getGames = () => {
    this.props.firebase
      .games()
      .once("value", snapshot => {
        this.data = snapshot.val();
      })
      .then(() => {
        this.setState({ currentGames: this.data });
      });
  };

  joinGame = event => {
    const key = event.target.id;
    const uid = this.props.authUser.uid;
    const data = {
      username: this.props.authUser.username,
      path: [[0, 0]],
      points: 0
    };

    let updates = {};

    updates["/games/" + key + "/users/" + uid] = data;
    updates["/users/" + uid + "/games/" + key] = true;

    this.props.firebase.user(uid).child("games").remove();
    this.props.firebase.db.ref().update(updates);
    this.setState({Redirect: true});
  };

  createGame = event => {
    const currentTime = Math.round(new Date().getTime() / 1000);
    const key = this.props.firebase.db.ref("games").push().key;
    const uid = this.props.authUser.uid;

    const data = {
      name: this.state.name,
      password: this.state.password,
      game_area: parseInt(this.state.game_area),
      game_time: currentTime + parseInt(this.state.game_time),
      users: {
        [uid]: {
          username: this.props.authUser.username,
          path: [[0, 0]],
          points: 0
        }
      }
    };

    let updates = {};

    updates["/games/" + key] = data;
    updates["/users/" + uid + "/games/" + key] = true;

    this.props.firebase.user(uid).child("games").remove();
    this.props.firebase.db.ref().update(updates);

    this.setState({
      name: "",
      password: "",
      game_area: "",
      game_time: "",
      Redirect: true
    });

    event.preventDefault();
  };

  componentWillMount() {
      this.checkIfUserInGame();
  }

  checkIfUserInGame = () => {
      this.props.firebase.user(this.props.authUser.uid).child("games").once("value", snapshot => {
          this.isInGame = snapshot.val()
      });
      if (this.isInGame !== null){
          this.setState({Redirect: true})
      };
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // Manages all changes of state on page
  showParts = e => {
    let trg = e.target.id;

    if (trg === "back-btn") {
      this.setState({
        parts: {
          showBack: false,
          showGameMenu: true,
          showGameList: false,
          showSetUpGame: false
        }
      });
    } else if (trg === "join-game") {
      this.setState({
        parts: {
          showGameList: true,
          showGameMenu: false,
          showBack: true
        }
      });
      this.setState({
        part: "join"
      });
    } else if (trg === "create-game") {
      this.setState({
        parts: {
          showSetUpGame: true,
          showGameMenu: false,
          showBack: true
        }
      });
    }
  };

  render() {
    if (this.state.Redirect) {
      return <Redirect push to="/game" />;
    }

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <StyledFlexContainer>
            {this.state.parts.showGameMenu ? (
              <StyledMenu onClick={this.showParts}>
                <StyledTitle>MENU</StyledTitle>
                <br />
                <StyledGameButton id="join-game" onClick={this.getGames}>
                  Join Game
                </StyledGameButton>
                <br />
                <StyledGameButton id="create-game" onClick={this.getGames}>
                  Create Game
                </StyledGameButton>
                <br />
              </StyledMenu>
            ) : null}

            {this.state.parts.showBack ? (
              <StyledBackToMenu id="back-btn" onClick={this.showParts}>
                Back to Menu
              </StyledBackToMenu>
            ) : null}

            {this.state.parts.showGameList ? (
              <StyledGameList>
                <br />
                <StyledListTitle>GAME FINDER</StyledListTitle>
                <br />
                {this.state.currentGames != null
                  ? Object.keys(this.state.currentGames).map(gameId => (
                      <StyledGameLi id={gameId} onClick={this.joinGame}>
                        {this.state.currentGames[gameId].name}
                      </StyledGameLi>
                    ))
                  : null}
                <br />
              </StyledGameList>
            ) : null}

            {this.state.parts.showSetUpGame ? (
              <StyledSetGame onSubmit={this.createGame}>
                <br />
                <StyledCreateTitle>SET UP GAME</StyledCreateTitle>
                <br />
                <StyledSetSelect>
                  Game Area
                  <select
                    name="game_area"
                    onChange={this.onChange}
                    value={this.state.game_area}
                  >
                    <option value="1"> Radius: 1 km</option>
                    <option value="2"> Radius: 2 km</option>
                    <option value="3"> Radius: 3 km</option>
                    <option value="4"> Radius: 4 km</option>
                  </select>
                </StyledSetSelect>
                <StyledSetSelect>
                  Set Game Time
                  <select
                    name="game_time"
                    onChange={this.onChange}
                    value={this.state.game_time}
                  >
                    <option value="3600"> 1 Hour</option>
                    <option value="7200"> 2 Hour</option>
                    <option value="10800"> 3 Hour</option>
                    <option value="14400"> 4 Hour</option>
                    <option value="18000"> 5 Hour</option>
                  </select>
                </StyledSetSelect>
                <StyledSetLi>
                  Give the game a name{" "}
                  <input
                    type="text"
                    onChange={this.onChange}
                    value={this.state.name}
                    name="name"
                    minLength="3"
                    maxLength="15"
                  />
                </StyledSetLi>
                <StyledSetLi>
                  Password for your game{" "}
                  <input
                    type="text"
                    onChange={this.onChange}
                    value={this.state.password}
                    name="password"
                  />
                </StyledSetLi>
                <br />

                <Link to={ROUTES.HOME}>
                <StyledCreateGame onClick={this.createGame}>
                  Create Game
                </StyledCreateGame>
                </Link>
                <br />
                
              </StyledSetGame>
            ) : null}

          </StyledFlexContainer>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition)
)(GameMenu);
