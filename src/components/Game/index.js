import React, { Component } from 'react';
import Styled from 'styled-components';
import HomeMap from '../HomeMap';
import GameMap from '../GameMap';
import { withFirebase } from '../Firebase';
import Chat from '../Chat';


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
        gameId: null,
        gameData: [],
        userPath: [],
        userPoints: 0
    };

    initializeGame = () => {
        this.props.firebase.auth.onAuthStateChanged(authUser => {
            if (authUser && navigator.geolocation) {
                this.setState({uid: authUser.uid});
                this.props.firebase.user(this.state.uid).once('value', snapshot => {
                    const data = snapshot.val();
                    const gameKey = Object.keys(data.games)[0];
                    this.setState({gameId: gameKey});
                    this.fetchGameData();
                }).then(() => {
                    if (this.timeRemaining){
                        this.watchUserPosition();
                        this.detectCollision();  
                    };
                });
            };
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

    // Appends user path in DB
    updatePosition = position => {
        const newPosition = [position.coords.latitude, position.coords.longitude];
        const userPath = this.state.userPath.slice();
        userPath.push(newPosition);
        this.setState({userPath: userPath}); 
        this.setState({userPoints: this.state.userPoints + 1});
        this.updateToDB();
    };

    fetchGameData = () => {
        this.props.firebase.game(this.state.gameId).once("value", snapshot => {
            const data = snapshot.val();
            this.setState({gameData: data});
        });
    };
    
    updateToDB = () => {
        this.props.firebase.game(this.state.gameId + '/users/' + this.state.uid).set({
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

    componentDidMount(){
        this.initializeGame()
    };

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    };
    
    render() {
        return (

            <StyledFlexContainer>

                <StyledMap className="map-container">
                    <GameMap 
                        userPosition={this.state.userPath[this.state.userPath.length - 1]}
                        gameData={this.state.gameData}
                        />
                </StyledMap>

                    {/* <div>
                        <button onClick={this.ShowChat}>Chat</button>
                    </div><br /> */}
                    {/* <StyledChatWindow id="chat-window">
                    <Chat />
                    </StyledChatWindow> */}
            </StyledFlexContainer>
        );
    }
}

export default withFirebase(Game);

