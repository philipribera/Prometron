import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import LocTwo from '../GeolocatedTwo'
import Styled from 'styled-components';


/* STYLED COMPONENTS */
const StyledFlexForm = Styled.div`
    flex-basis: 40%;
    @media (max-width: 768px) {
      flex-basis: 100%;
    }
`;
const StyledMap = Styled.div`
    z-index: 9999;
    flex-basis: 59%;
    border: 2px solid rgb(252,252,252);
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
const StyledFbGlField = Styled.div`
    padding: 8px 0;    
    margin: 12px 12px 12px 0;
    border-bottom: 2px solid rgb(247,247,247);
    & form {
      display: inline;
    }
    & button {         
      margin: 6px 22px 6px 0;
    }
`;


const SignInPage = () => (

    <React.Fragment>
        <StyledFlexForm>
            <StyledTitle>Sign in</StyledTitle><br />
            <SignInForm />
            <PasswordForgetLink />
            <br />
            <SignInGoogle />
            <SignInFacebook /><br />
            <SignUpLink />
            <StyledFbGlField className="login-FB-GL">
            </StyledFbGlField>
        </StyledFlexForm>

        <StyledMap className="map-container">
            <LocTwo />
        </StyledMap>
    </React.Fragment>
);


const ERROR_CODE_ACCOUNT_EXISTS =
    'auth/account-exists-with-different-credential';
const ERROR_MSG_ACCOUNT_EXISTS =
    `An account with an E-Mail address to
    this social account already exists. Try to login from
    this account instead and associate your social accounts on
    your personal account page.`;

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {

        const { email, password } = this.state;
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })

            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <StyledInput
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                /><br />
                <StyledInput
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                /><br />
                <StyledSubmit disabled={isInvalid} type="submit">
                    Sign In
                </StyledSubmit>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                return this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email,
                        roles: [],
                        position: { latitude: "0", longitude: "0" }
                    });
            })
            .then(() => {
                this.setState({ error: null });
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
    render() {
        const { error } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Sign In with Google</button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

class SignInFacebookBase extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.firebase
            .doSignInWithFacebook()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                return this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.additionalUserInfo.profile.name,
                        email: socialAuthUser.additionalUserInfo.profile.email,
                        roles: [],
                        position: { latitude: "0", longitude: "0" }
                    });
            })
            .then(socialAuthUser => {
                this.setState({ error: null });
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
    render() {
        const { error } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Sign In with Facebook</button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
    withRouter,
    withFirebase,
)(SignInFacebookBase);

export default SignInPage;
export { SignInForm, SignInGoogle, SignInFacebook };