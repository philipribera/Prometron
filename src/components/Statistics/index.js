import React from 'react';
import Styled from 'styled-components';

import { withFirebase } from "../Firebase";

const StyledStat = Styled.section`
    flex-basis: 30%;
    min-width: 332px;
    min-height: 270px;
    max-height: 302px;
    padding: 12px;
    border: 2px solid rgb(177,177,177);
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

let userData = {
    statistics: {
        playedgames: 0,
        wongames: 0,
        walkeddistance: 0,
        points: 0,
    }
};

const Statistics = (props) => {

    props.firebase.user(props.userId).once("value", snapshot => {
        userData = snapshot.val();
    });

    return (
        <StyledStat> 
            <h2>STATISTICS</h2>
            <br />
            <div>
            <p>
                Played Games <span>{userData.statistics.playedgames}</span>
            </p>
            <br />
            <p>
                Won Games <span>{userData.statistics.wongames}</span>
            </p>
            <br />
            <p>
                Walked Distance <span>{userData.statistics.walkeddistance} km</span>
            </p>
            <br />
            <p>
                Earned Points <span>{userData.statistics.points}</span>
            </p>
            <br />
            <br />
            </div>
        </StyledStat>
    );
}
 
export default withFirebase(Statistics);