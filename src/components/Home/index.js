import React from "react";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";

import LocatedTwo from '../GeolocatedTwo'

import Chat from "../Chat";
import Styled from "styled-components";

// This was removed from 'const HomePage'
//<LocatedTwo userId={authUser.uid} />

const StyledFlexContainer = Styled.div`
    display: flex;
    flex-wrap: wrap;
    height: auto;
    min-height: 492px;
    padding: 22px 12px;
`;

const StyledDivs = Styled.div`
    flex-basis: 45%;    
    min-height: 300px;
    padding: 22px;
    @media (max-width: 767px) {
        flex-basis: 100%;
        padding: 12px;
    }
    @media (max-width: 492px) {        
        padding: 4px;
    }
`;

const StyledChat = Styled.section`
    flex-basis: 55%;
    min-width: 332px;
    min-height: 292px;
    max-height: 500px;
    padding: 12px;
    border: 2px solid rgb(177,177,177);
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

const StyledStat = Styled.section`
    flex-basis: 55%;
    min-width: 332px;
    min-height: 300px;
    max-height: 500px;
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

const StyledTextContent = Styled.article`
    padding: 22px;
`;

const StyledMap = Styled.div`    
    flex-basis: 79%;
    border: 2px solid rgb(252,252,252);
    @media (max-width: 768px) {
    flex-basis: 100%;
}`;



const HomePage = props => (
  <AuthUserContext.Consumer>
    {authUser => (
        
      <React.Fragment>
        <StyledDivs>
          <h3>Home Page{authUser.email}</h3>
          <p>The Home Page is accessible by every signed in user.</p>
        </StyledDivs>
        <StyledDivs>

          <StyledChat>
            <h2>Here we will have chat</h2>
            
            <StyledTarea cols="42" rows="8"></StyledTarea>
            <br />
            <StyledInput type="text" /><br />
            <button>Send Message</button>
          </StyledChat>
          <br />

          <StyledStat>
            <h2>STATISTICS</h2>
            <br />
            <StyledTextContent>
              <p>
                Played Games <span>222</span>
              </p>
              <br />
              <p>
                Walked Distance <span>222</span>
              </p>
              <br />
              <p>
                Earned Points <span>222</span>
              </p>
              <br />
              <p>
                More Stat <span>222</span>
              </p>
              <br />
            </StyledTextContent>
          </StyledStat>
        </StyledDivs>
        
        <br />
        
        
        <StyledMap className="map-container">
            {`Temporary map`}
            <LocatedTwo userId={authUser.uid} />
        </StyledMap>

      </React.Fragment>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

//export default withAuthorization(condition)(HomePage);
export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
