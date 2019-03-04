import React from "react";
import { withFirebase } from "../Firebase";

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
    }    
    @media (max-width: 767px) {
        flex-basis: 100%;
        padding: 12px;
    }
`;
const GameNameTime = Styled.span`
    display: inline-block;
    margin-bottom: 12px;
    & span {
        margin-left: 12px;
    }
    h2 {
        display: inline;
        color: rgb(255, 143, 0);
        text-shadow: none;
    }
`;
const TimeData = Styled.span`
    color: rgb(234,234,234);
`;
const PlayerScore = Styled.div`
    margin-left: 4px;
    & span {
        margin-left: 12px;
    }
`;
const OpponentScore = Styled.div`
   & ul {
    margin-left: 4px;
   } 
   & h3 {
    color: rgb(255, 143, 0);
    margin-bottom: 12px;
   } 
   & span {
       margin-left: 12px;
   }
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

    props.firebase.user(props.userId).once("value", snapshot => {
        userData = snapshot.val();
    });

    return (            
        <StyledStat>
            <GameNameTime><h2>Game Score</h2><TimeData>Remaining time: 54:01</TimeData></GameNameTime>
            <br />
            <PlayerScore>
                <p>
                  Walked Distance <span>{userData.statistics.walkeddistance} km</span> 
                </p>                
                <p>
                    Earned Points <span>{userData.statistics.points}</span>
                </p>                                 
                <br />
            </PlayerScore >
            <hr /><br />
            <OpponentScore>
                <h3>Opponents</h3>
                <ul>
                    <li>Carola</li>
                    <li>Blue</li>
                    <li>Penguin</li>
                </ul>
            </OpponentScore>
        </StyledStat>
    );
}


export default withFirebase(GameScore);