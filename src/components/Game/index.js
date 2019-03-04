import React, { Component } from 'react';
import Styled from 'styled-components';
import HomeMap from '../HomeMap';
import GameMap from '../GameMap';
import { withFirebase } from '../Firebase';
import Chat from '../Chat';
import GameScore from '../GameScores';
import { compose } from "recompose";

import {
    AuthUserContext,
    withAuthorization,
} from "../Session";

/*** STYLED COMPONENETS ***/
const StyledFlexContainer = Styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
    min-height: 492px;    
`;
const StyledMap = Styled.div`    
    position: relative;
    flex-basis: 100%;    
    border: 1px solid rgb(177,177,177);    
    border-top: 1px solid rgb(252,252,252);
`;

const ScoreBoard = Styled.div`
    position: absolute;
    top: 2%;
    right: 2%;
    z-index: 999;
    background: rgba(12,12,12,0.65);
    color: rgb(255, 211, 45);
    border: 1px solid rgb(244,244,244);
`;
const StyledChat = Styled.section`
    flex-basis: 100%;
    min-width: 332px;
    min-height: 292px;
    max-height: 500px;
    padding: 12px;
    border: 1px solid rgb(177,177,177);
    border-top: none;
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
/*
const StyledChatWindowHd = Styled.div`
    display: none;
`;

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
`;*/
/*** END ***/


class Game extends Component {
    state = {
        gameId: null,
        gameData: [],
        userPath: [],
        userPoints: 0,
        parts: {
            scoreBoard: true,
            chatBoard: false
        }
    };

    calculateDistance = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // km (change this constant to get miles)
        var dLat = ((lat2 - lat1) * Math.PI) / 180;
        var dLon = ((lon2 - lon1) * Math.PI) / 180;
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return Math.round(d * 1000);
    };

    initializeGame = () => {
        const { authUser } = this.props;

            if (authUser && navigator.geolocation && this.timeRemaining) {
                this.setState({uid: authUser.uid});
                this.props.firebase.user(authUser.uid).once('value', snapshot => {
                    const data = snapshot.val();
                    const gameKey = Object.keys(data.games)[0];
                    this.setState({gameId: gameKey});
                    this.fetchGameData();
                }).then(() => {
                    this.watchUserPosition();
                    this.detectCollision();  
                });
            };
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

    // Appends user path in DB
    updatePosition = position => {
        const newPosition = [position.coords.latitude, position.coords.longitude];

        const oldPosition = this.state.userPath[this.state.userPath.length - 1]

        if (this.calculateDistance(newPosition[0], newPosition[1], oldPosition[0], oldPosition[1]) > 1) {
            const userPath = this.state.userPath.slice();
            userPath.push(newPosition);
            this.setState(prevState => ({userPoints: prevState.gameData.users[this.props.authUser.uid].points + 1, userPath: userPath}));
            this.updateToDB();
        };
    };

    fetchGameData = () => {
        this.props.firebase.game(this.state.gameId).on("value", snapshot => {
            const data = snapshot.val();
            this.setState({ gameData: data });
        });
    };

    updateToDB = () => {
        this.props.firebase.game(this.state.gameId + '/users/' + this.state.uid).set({
            username: this.props.authUser.username,
            path: this.state.userPath,
            points: this.state.userPoints
        });
    };

    timeRemaining = () => {
        const currentTime = Math.round((new Date()).getTime() / 1000);
        if (currentTime < this.state.gameData.gametime) {
            return true
        } else {
            return false
        }
    }

    detectCollision = () => {
        //TODO
    }

    componentWillMount(){
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({userPath: [[position.coords.latitude, position.coords.longitude]]})
        });
        this.initializeGame()
    };

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
        this.props.firebase.game(this.state.gameId).off();
    };

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <StyledFlexContainer>

                        <StyledMap className="map-container">
                            <GameMap
                                userPosition={this.state.userPath[this.state.userPath.length - 1]}
                                users={this.state.gameData.users}
                            />
                            <ScoreBoard>
                                <GameScore 
                                    userId={authUser.uid}
                                    gameData={this.state.gameData}
                            />
                            </ScoreBoard>
                        </StyledMap>

                        <div>
                            <button onClick={this.ShowChat}>Chat</button>
                        </div><br />

                        { this.state.parts.chat ? (
                        <StyledChat id="chat-window">
                        <Chat />
                        </StyledChat> 
                        ) : null }
                        
                    </StyledFlexContainer>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

//export default withFirebase(withAuthorization(Game)(() => true);

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withAuthorization(condition)
)(Game);

