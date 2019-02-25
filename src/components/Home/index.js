import React from "react";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";

//import Chat from "../Chat";
import Styled from "styled-components";
import HomeMap from "../HomeMap";


/*** STYLED COMPONENTS ***/
const StyledFlexContainer = Styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
    min-height: 492px;    
`;

const StyledDivs = Styled.div`
    flex-basis: 100%;    
    text-align: center;    
`;

const StyledH1 = Styled.h1`
    font-family: 'Orbitron', sans-serif;
    letter-spacing: -0.05em;
    font-size: 2.5em;
    background: rgb(239, 152, 44);
    color: rgb(252, 252, 252);    
    text-shadow: rgb(15, 15, 15) 0.5px 1.5px 0.5px;      
    padding: 22px 0;
    margin: auto;
    border: 1px solid rgb(177,177,177);    
    border-bottom: none;
    cursor: pointer;   
    &:hover {
      background: rgb(35,35,35);
      color: rgb(241, 153, 47);               
    }
    @media (max-width: 767px) {
      font-size: 2em;
    }
    @media (max-width: 492px) {
      font-size: 1.7em;
    }
`;

const StyledMap = Styled.div`    
    flex-basis: 100%;
    border: 1px solid rgb(177,177,177);    
    border-top: 1px solid rgb(252,252,252);
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

const StyledInput = Styled.input`
    padding: 4px;
    margin: 4px    
`;

const StyledTarea = Styled.textarea`
    max-height: 300px;
    max-width: 492px;
    @media (max-width: 767px) {
        max-width: 330px;
    }
`;

const HomePage = props => (
  <AuthUserContext.Consumer>
    {authUser => (
        <StyledFlexContainer>
          
          <StyledDivs>
            <StyledH1>ENTER GAME</StyledH1>
          </StyledDivs>

          <StyledMap className="map-container">           
            <HomeMap userId={authUser.uid} />
          </StyledMap>

          <StyledChat>
            <h2>MESSAGE BOARD</h2>
            <StyledTarea cols="42" rows="8" />
            <br />
            <StyledInput type="text" />
            <br />
            <button>Send Message</button>
          </StyledChat>
          

        </StyledFlexContainer>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
