import React, { Component } from 'react';
import { withFirebase } from "../Firebase";
import Styled from 'styled-components';
import { longStackSupport } from 'q';


/*** STYLED COMPONENTS ***/
const StyledResultsDiv = Styled.div`   
    font-family: 'Orbitron',sans-serif;
    width: auto; 
    min-width: 338px;  
    background-color: rgb(47, 84, 105);
    color: rgb(245,245,245);   
    padding: 12px 38px;
    border: 2px solid rgb(192,192,192);
    box-shadow: 2px 2px 2px rgb(177,177,177);
    & hr {
        border: 1px solid rgb(157,157,157);
        margin-bottom: 4px;
    }
    @media (max-width: 767px) {        
        flex-basis: 100%;
        min-height: 158px;        
        font-size: 0.87em;
        text-align: center;
        padding: 8px;
        & h2 {
            margin-bottom: 6px;
        }
    }
    @media (max-width: 492px) {        
        flex-basis: 100%;
        min-width: 336px;      
        box-shadow: none;  
        font-size: 0.78em;        
        padding: 4px;       
    }
`;
const StyledPlayerTitle = Styled.h1`
    text-align: center;
    font-size: 2.1em;
    color: rgb(255, 143, 0);
    text-shadow: 1px 1px 0.5px rgb(15,15,15);
    margin-bottom: 12px;
    @media (max-width: 767px) {
        font-size: 1.8;
    }
`;
const StyledResultStatistic = Styled.h3`
    text-align: center;
    font-size: 1.6em;
    color: rgb(73, 100, 181);
    color: rgb(207, 208, 210);
    @media (max-width: 767px) {
        font-size: 1.45;
    }
`;
const StyledStatisticDiv = Styled.div`
    padding: 12px;
    @media (max-width: 767px) {
        text-align: center;
    }
`;
const StyledResultGame = Styled.h3`
    text-align: center;
    font-size: 1.5em;
    color: rgb(73, 100, 181);
    @media (max-width: 767px) {
        font-size: 1.3;
    }
`;
const StyledResultLi = Styled.li`
    list-style-type: none;
    padding: 4px 0;
    margin: 4px 0;
`;
const StyledSpanPos = Styled.span`
    margin-right: 12px;
    & span {
        color: rgb(255, 131, 0);
        font-weight: 600;
        margin-left: 12px;
    }
`;
/*** END ***/


let userData = {
    statistics: {
        result: "Loss",
        position: 1,
        walkeddistance: 0,
        timeWalked: 0,
        timePlayed: 0,
        points: 0
    }
};

const GameResults = (props) => {
    let gameData = {};
    let uid = props.authUser.uid;
    props.firebase.game(props.gameId).once("value", snapshot => {
        gameData = snapshot.val()
    });
    let users = Object.keys(gameData.users)


    return (
        <StyledResultsDiv><br />
            <StyledPlayerTitle>Player: {props.authUser.username}</StyledPlayerTitle>
            <hr />
            <br />
            <StyledResultStatistic>
            Game Result: {userData.statistics.result} </StyledResultStatistic><br />
            <hr /><br />
            {/* <StyledResultGame>{userData.statistics.result}</StyledResultGame><br /> */}

            <StyledStatisticDiv>
                <h4>STATISTICS</h4><br />
                <ul>
                    <StyledResultLi>
                        Position in game: <span>{userData.statistics.position} </span>
                    </StyledResultLi>
                    <StyledResultLi>
                        Earned Points: <span>{gameData.users[uid].points} </span>
                    </StyledResultLi>
                    <StyledResultLi>
                        Walked Distance: <span>{gameData.users[uid].points / 100} km</span>
                    </StyledResultLi>
                    <StyledResultLi>
                        Time Played: <span>{userData.statistics.timePlayed} </span>
                    </StyledResultLi>
                </ul>
            </StyledStatisticDiv>
            <hr /><br />

            <StyledStatisticDiv>
                <h4>OPPONENTS</h4><br />
                <ul>
                    {users.map(user => (
                        user !== uid ?
                        <li key={props.userId}>{gameData.users[user].username} <span>{gameData.users[user].points}</span></li>
                        : null
                    ))}
                </ul>
            </StyledStatisticDiv>

        </StyledResultsDiv>
    );
}


export default withFirebase(GameResults);
