import React, { Component } from 'react';
import { withFirebase } from "../Firebase";
import Styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

/*** STYLED COMPONENTS ***/
const StyledResultsDiv = Styled.div`   
    position: relative;
    font-family: 'Orbitron',sans-serif;
    height: 100%;
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

const StyledLeaveLink = Styled.div`
    display: flex;
    justify-content: center;
    z-index: 999;    
    & a {
        background: rgb(77,77,77);
        color: rgb(242,242,242);
        padding: 6px;
        &:hover {
            background: rgb(17,17,17);
            color: rgb(255,255,255);        
        }
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
class GameResults extends Component {
    state = {
    };

    calculatePosition = () => {
        this.users = Object.keys(this.state.gameData.users);
        this.users.forEach(user => {
            this.positions[user] = this.state.gameData.users[user].points
        });
        this.setState({positions: this.positions})
        const positionsSorted = Object.keys(this.state.positions).sort(function(a,b){return this.state.positions[a]-this.state.positions[b]})
        console.log(this.state.positions);
        console.log(positionsSorted);
    };

    componentDidMount(){
        this.uid = this.props.authUser.uid;
        this.positions = {};
        this.props.firebase.game(this.props.gameId).once("value", snapshot => {
            this.setState({ gameData: snapshot.val() });
        }).then(() => 
            this.calculatePosition()
        );
    };

    render() {
        return (
            this.state.gameData ? 
            <StyledResultsDiv><br />
                <StyledPlayerTitle>Player: {this.props.authUser.username}</StyledPlayerTitle>
                <hr />
                <br />
                <StyledResultStatistic>
                    Game Result: </StyledResultStatistic><br />
                <hr /><br />
                <StyledResultGame></StyledResultGame><br />

                <StyledStatisticDiv>
                    <h4>STATISTICS</h4><br />
                    <ul>
                        <StyledResultLi>
                            Position in game: <span></span>
                        </StyledResultLi>
                        <StyledResultLi>
                            Earned Points: <span>{this.state.gameData.users[this.uid].points} </span>
                        </StyledResultLi>
                        <StyledResultLi>
                            Walked Distance: <span>{this.state.gameData.users[this.uid].points / 100} km</span>
                        </StyledResultLi>
                    </ul>
                </StyledStatisticDiv>
                <hr /><br />


                <StyledStatisticDiv>
                    <h4>OPPONENTS</h4><br />
                    <ul>
                        {this.state.gameData.users.length > 1 ? 
                        this.state.gameData.users.map(user => (
                            user !== this.uid ?
                            <li>{this.state.gameData.users[user].username} <span>{this.state.gameData.users[user].points}</span></li>
                            : null
                        )) : null 
                        }
                </ul>
                    <StyledLeaveLink onClick={this.leaveGame}>
                        <Link to={ROUTES.HOME}>Leave Game</Link>
                    </StyledLeaveLink>
                </StyledStatisticDiv>

            </StyledResultsDiv>
            : null
        );
    }
}

// const GameResultz = (props) => {

//     // users = Object.keys(gameData.users);
//     // users.forEach(user => {
//     //     usersPoints[gameData[users][user]] = gameData[users][user].points
//     // });
//     // console.log(usersPoints)



//     return (
//         <StyledResultsDiv><br />
//             <StyledPlayerTitle>Player: {props.authUser.username}</StyledPlayerTitle>
//             <hr />
//             <br />
//             <StyledResultStatistic>
//                 Game Result: </StyledResultStatistic><br />
//             <hr /><br />
//             {/* <StyledResultGame>{userData.statistics.result}</StyledResultGame><br /> */}

//             <StyledStatisticDiv>
//                 <h4>STATISTICS</h4><br />
//                 <ul>
//                     <StyledResultLi>
//                         Position in game: <span></span>
//                     </StyledResultLi>
//                     <StyledResultLi>
//                         Earned Points: <span>{gameData.users[uid].points} </span>
//                     </StyledResultLi>
//                     <StyledResultLi>
//                         Walked Distance: <span>{gameData.users[uid].points / 100} km</span>
//                     </StyledResultLi>
//                     <StyledResultLi>
//                         Time Played: <span></span>
//                     </StyledResultLi>
//                 </ul>
//             </StyledStatisticDiv>
//             <hr /><br />


//             <StyledStatisticDiv>
//                 <h4>OPPONENTS</h4><br />
//                 <ul>
//                     {/* {users.length > 1 ? 
//                         users.map(user => (
//                             user !== uid ?
//                             <li key={props.userId}>{gameData.users[user].username} <span>{gameData.users[user].points}</span></li>
//                             : null
//                         )) : null */}
//                     }
//                 </ul>
//             </StyledStatisticDiv>

//             <StyledLeaveLink onClick={this.leaveGame}>
//                 <Link to={ROUTES.HOME}>Leave Game</Link>
//             </StyledLeaveLink>

//         </StyledResultsDiv>
//     );
// }


export default withFirebase(GameResults);
