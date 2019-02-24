import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import Styled from 'styled-components';

// THIS IS RENDERED
const SignUpPage = () => (
  <div>    
    <SignUpForm />
  </div>
);


/*** STYLED COMPONENETS ***/
const StyledFlexDiv = Styled.div`
    flex-basis: 40%;
    @media (max-width: 768px) {
      flex-basis: 100%;
    }
`;
const StyledTitle = Styled.h1`
    font-size: 2em;
    color: rgb(35, 123, 226);
`;
const StyledInput = Styled.input`
    padding: 4px;
    margin: 4px    
`;
const StyledSubmit = Styled.button`
    padding: 6px 8px;
    background-color: rgb(22, 88, 182);
    color: rgb(244,244,244);
    cursor: pointer;
    margin: 12px 0;
    border-radius: 5px;
    &:hover {
        opacity: 0.9;        
    }
`;
/*** END ***/


const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = [];

    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
          status: "Online",
          description: "",
          statistics: {playedgames: "0", wongames: "0", walkeddistance: "0", points: "0"},
          position: { latitude: "0", longitude: "0" }
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <StyledFlexDiv>
        
        <form onSubmit={this.onSubmit}>
        <StyledTitle>Sign up</StyledTitle><br />
        <br />
        <StyledInput
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        /><br />
        <StyledInput
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        /><br />
        <StyledInput
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        /><br />
        <StyledInput
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        /><br /><br />
        <label>
          Admin:
          <StyledInput
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={this.onChangeCheckbox}
          />
        </label><br />
        <StyledSubmit disabled={isInvalid} type="submit">
          Sign Up
        </StyledSubmit>

        {error && <p>{error.message}</p>}
        </form>
      </StyledFlexDiv>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);
const SignUpForm = withRouter(withFirebase(SignUpFormBase));
export default SignUpPage;
export { SignUpForm, SignUpLink };