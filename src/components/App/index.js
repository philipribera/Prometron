import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import Navigation from '../Navigation';
//import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import GamePage from '../Game';
import GameMenu from '../GameMenu';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import Styled from 'styled-components';
import Chat from '../Chat'

/* STYLED COMPONENTS */
const StyledFlexContainer = Styled.div`
    display: flex;
    flex-wrap: wrap;
    height: auto;
    min-height: 492px;    
`;
const StyledTitle = Styled.span`
    font-family: 'Orbitron', sans-serif;
    font-size: 1.9em;
    color: rgb(35, 123, 226);
    text-shadow: 1px 1px 0.5px rgb(252,252,252);
    @media (max-width: 768px) {
        font-size: 1.7em;
    }
    @media (max-width: 468px) {
        font-size: 1.4em;       
    }
`;
const StyledH2 = Styled.h2`
    font-family: Geneva, Verdana, sans-serif;
    font-family: 'Orbitron', sans-serif;    
    font-size: 1.7em;
    font-style: oblique;
    color: rgb(255, 183, 77);
    text-shadow: rgb(57, 57, 57) 1px 1px 0.5px;    
    @media (max-width: 768px) {
        font-size: 1.5em;
    }
    @media (max-width: 468px) {
        font-size: 1.25em;
    }
`;
/*** END STYLED COMPONENTS ***/


const App = () => (
    <div className="wrapper">
        
        <h1><StyledTitle>PROMETRON</StyledTitle></h1>
        <StyledH2>Take a walk with Prometron...</StyledH2>
        <br />

        <Router>
            <div>
                <Navigation />
                <hr />
                <StyledFlexContainer>                    
                    <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
                    <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                    <Route
                        path={ROUTES.PASSWORD_FORGET}
                        component={PasswordForgetPage}
                    />
                    <Route path={ROUTES.HOME} component={HomePage} />
                    <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                    <Route path={ROUTES.ADMIN} component={AdminPage} />
                    <Route path={ROUTES.GAME} component={GamePage} />
                    <Route path={ROUTES.GAMEMENU} component={GameMenu} />
                    <Route path={ROUTES.CHAT} component={Chat} />

                </StyledFlexContainer>
            </div>
        </Router>
        
    </div>
);

export default withAuthentication(App);
