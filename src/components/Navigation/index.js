import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import Styled from 'styled-components';

/*** STYLED COMPONENTS ***/
const StyledUl = Styled.ul`
  margin: 12px;
`;
const StyledLi = Styled.li`
    display: inline;
    font-size: 1em;
    cursor: pointer;
    list-style-type: none;    
    margin-right: 22px;
    & a {
      text-decoration: none;
      color: rgb(77,77,77);      
    }
    & button {
      margin-top: 10px;
    }
`;


const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <StyledUl>        
        <StyledLi>
            <Link to={ROUTES.HOME}>Home</Link>
        </StyledLi>
        <StyledLi>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </StyledLi>
        <StyledLi>
            <Link to={ROUTES.ADMIN}>Admin</Link>
        </StyledLi>
        <StyledLi>
            <SignOutButton />
        </StyledLi>
    </StyledUl>
);

const NavigationNonAuth = () => (
    <StyledUl>        
        <StyledLi>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </StyledLi>
    </StyledUl>
);

export default Navigation;