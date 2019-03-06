import React, { Component } from 'react';
import { withFirebase } from "../Firebase";
import Styled from 'styled-components';

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

    calculatePosition = () => {
        this.users = Object.keys(this.props.data.users);
        this.users.forEach(user => {
            this.positions[user] = this.props.data.users[user].points
        });
        this.setState({positionsSorted: Object.keys(this.positions).sort((a,b) => (this.positions[b] - this.positions[a]))})
        ;
    };

    componentWillMount(){
        this.uid = this.props.authUser.uid;
        this.positions = {};
        this.calculatePosition()
    };

    render() {
        return (
            this.props.data && this.state ? 
            <StyledResultsDiv><br />
                <StyledPlayerTitle>Player: {this.props.authUser.username}</StyledPlayerTitle>
                <hr />
                <br />
                <StyledResultStatistic>
                Game Result: {this.state.positionsSorted[0] === this.uid ? 
                    <span style={{color: "green"}}>
                        You Won!
                    </span>
                    :
                    <span style={{color: "red"}}>
                        You lost..
                    </span>
                }
                </StyledResultStatistic><br />
                <hr /><br />
                <StyledResultGame></StyledResultGame><br />

                <StyledStatisticDiv>
                    <h4>STATISTICS</h4><br />
                    <ul>
                        <StyledResultLi>
                            Placement: {this.state.positionsSorted.indexOf(this.uid) + 1}<span></span>
                        </StyledResultLi>
                        <StyledResultLi>
                            Earned Points: <span>{this.props.data.users[this.uid].points} </span>
                        </StyledResultLi>
                        <StyledResultLi>
                            Walked Distance: <span>{this.props.data.users[this.uid].points / 100} km</span>
                        </StyledResultLi>
                    </ul>
                </StyledStatisticDiv>
                <hr /><br />


                <StyledStatisticDiv>
                    <h4>OPPONENTS</h4><br />
                    <ul>
                        {this.state.positionsSorted.map(user => (
                            user !== this.uid ?
                            <li>{this.props.data.users[user].username}
                                <span> &nbsp; &nbsp; {this.props.data.users[user].points}</span>
                            </li>
                            : null
                        ))}
            
                    </ul>
                </StyledStatisticDiv>
            </StyledResultsDiv>
            : null
        );
    }
}

export default withFirebase(GameResults);