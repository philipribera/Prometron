import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";

import Styled from 'styled-components';


/*** STYLED COMPONENTS ***/
const StyledStat = Styled.div`
    flex-basis: 30%;
    min-width: 332px;
    min-height: 270px;
    max-height: 302px;
    padding: 12px;
    border: 2px solid rgb(192,192,192);
    & h2 {
        color: rgb(29, 134, 226);
        text-shadow: 1px 1px 0.5px rgb(252,252,252);
        margin-bottom: 12px;
    }
    & span {
        color: rgb(122,122,222);
        font-weight: 600;
        padding: 4px;
    }    
    @media (max-width: 767px) {
        flex-basis: 100%;
        padding: 12px;
    }
`;

const PlayerScore = Styled.div`
    border: 1px solid rgb(252,252,252);

`;
const OpponentScore = Styled.div`
    border: 1px solid rgb(252,252,252);   

`;
/*** END ***/

let userData = {
    statistics: {
        playedgames: 0,
        wongames: 0,
        walkeddistance: 0,
        points: 0,
    }
};


const GameScore = (props) => {

    /*
    props.firebase.user(props.userId).once("value", snapshot => {
        userData = snapshot.val();
    });*/

    return (
        <StyledStat>
            <h2>Game Score</h2>
            <br />
            <PlayerScore>                
                <p>
                    {/* Game <span>{userData.statistics.wongames}</span> */}
                </p>
                <br />
                <p>
                    {/* Walked Distance <span>{userData.statistics.walkeddistance} km</span> */}
                </p>
                <br />
                <p>
                    {/* Points <span>{userData.statistics.points}</span> */}
                </p>
                <br />                
            </PlayerScore><br />
            <OpponentScore>
                <ul>
                    <li>Carola</li>
                    <li>Blue</li>
                    <li>Penguin</li>
                </ul>
            </OpponentScore>
        </StyledStat>
    );
}


export default GameScore;