import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from '../../constants/roles';
import Styled from "styled-components";

/* STYLED COMPONENTS */
const StyledTitle = Styled.h1`
    font-size: 2em; 
    color: rgb(35, 123, 226);
`;
const StyledInput = Styled.input`
    padding: 4px;
    margin: 4px    
`;
/* END STYLED COMPONENTS */


const SignUpPage = () => (
    <div>
        <StyledTitle>Sign up</StyledTitle><br />
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
    isAdmin: false,
    error: null
};

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
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                        roles,
                        position: { latitude: "0", longitude: "0" }
                    });
            })
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

    onChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const { username, email, passwordOne, passwordTwo, isAdmin, error } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            email === "" ||
            username === "";

        return (

            <form onSubmit={this.onSubmit}>
                <StyledInput
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />
                <br />
                <StyledInput
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <br />
                <StyledInput
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <br />
                <StyledInput
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                /><br /><br />
                <label>
                    Admin:
                <input
                        name="isAdmin"
                        type="checkbox"
                        checked={isAdmin}
                        onChange={this.onChangeCheckbox}
                />
                </label>
                <br />
                <button disabled={isInvalid} type="submit">
                    Sign Up
          </button>
                {error && <p>{error.message}</p>}
            </form>

        );
    }
}

const SignUpLink = () => (
    <React.Fragment>
        <p>
            Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
        </p>
        <br />
    </React.Fragment>
);

const SignUpForm = compose(
    withRouter,
    withFirebase
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };
