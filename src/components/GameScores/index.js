import React from "react";
import { withFirebase } from "../Firebase";
import Styled from 'styled-components';


/*** STYLED COMPONENTS ***/
const StyledStat = Styled.div`
    flex-basis: 30%;
    min-height: 192px;
    max-height: 240px;
    overflow-hidden;
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
        font-size: 0.85em;
        flex-basis: 100%;
        min-height: 158px;
        max-height: 222px;
        padding: 8px 6px;
        & h2 {
            margin-bottom: 6px;
        }
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
    
    const users = Object.keys(props.users)

    return (
        <StyledStat>
            <GameNameTime><h2>Game Score</h2></GameNameTime>
            <br />            
            <OpponentScore>

                <ul>
                    {users.map(user => (
                        <li>{props.users[user].username} <span>{props.users[user].points}</span></li>
                    ))}
                </ul>
            </OpponentScore>
        </StyledStat>
    );
}


export default withFirebase(GameScore);