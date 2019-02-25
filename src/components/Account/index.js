import React, { Component } from "react";
import { compose } from "recompose";

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
import Styled from "styled-components";

import Statistics from '../Statistics';
import Avatars from '../Avatars';

/*** STYLED COMPONENTS ***/
const StyledFlexContainer = Styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
    min-height: 492px;  
`;
const StyledCharacter = Styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: max-content;    
    margin-bottom: 42px;
    & button {
      background-color: rgb(216, 124, 45);
      background-color: rgb(77,77,77);
      border: 1px solid rgb(202,202,202);
    }
    & button:hover {     
      background-color: rgb(35,35,35);
      border: 1px solid rgb(254,254,254);      
    }
`;
/*
const StyledAvatar = Styled.figure`
    flex-basis: 14%;
    position: relative;
    & img {
      width: 210px;
      max-height: 230px;
      border: 2px solid rgb(254,254,254);
    }
    @media (max-width: 767px) {
      margin-bottom: 22px;
    }
`;
const StyledStatus = Styled.div`
    position: absolute;
    background-color: ${props => props.backgroundColor};
    top: 7%;
    right: 7%;
    width: 36px; 
    height: 36px;
    display: inline-block;
    border: 1px solid white;        
    border-radius: 50%;        
`;
*/
const StyledCharData = Styled.div`
    flex-basis: 30%;
    padding: 12px;
    & h2 {
      font-size: 1.8em;
      color: rgb(251, 151, 0);
      text-shadow: 1px 1px 0.5px rgb(57,57,57);
    }
    @media (max-width: 767px) {
      flex-basis: 48%;      
      margin-bottom: 72px;
    }
    @media (max-width: 492px) {
      flex-basis: 100%;      
    }
`;

const StyledProfileEdit = Styled.div`
    display: none;
`;

const StyledUl = Styled.ul`   
    display: none;
    & li {      
      display: inline;      
      cursor: pointer;
      color: rgb(56, 53, 52);
      text-shadow: 1px 1px 0.5px rgb(255,255,255);
      font-weight: 600;
      padding: 0 4px;
      margin-right: 6px;      
    }
    & li:hover {      
      color: rgb(15,15,15);
      text-shadow: 1px 1px 0.5px rgb(227,227,227);
    }
`;

/*** END ***/

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null
  },
  {
    id: "google.com",
    provider: "googleProvider"
  },
  {
    id: "facebook.com",
    provider: "facebookProvider"
  },
  {
    id: "twitter.com",
    provider: "twitterProvider"
  }
];

/*** NEW CLASS TO HANDLE CHARACTER DATA AND ONLINE STATUS ***/
class AccountPage extends Component {
  constructor(props) {
    super(props);

    this.statusLight="rgb(83, 205, 13)"

    this.state = {
      userData: {
        statistics: {
          playedgames: 0,
          wongames: 0,
          walkeddistance: 0,
          points: 0,
        }
      }
    };
  };
  
  fetchUserData = () => {
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
        this.props.firebase.user(this.userId).on("value", snapshot => {
          this.setState({userData: snapshot.val()}) 
        });
      } else {
        return
      };
    });
  };

  // Displays status choices
  showStatusChoice = () => {
    let statUl = document.getElementById("status-ul");
    if (statUl.style.display === "block") {
      statUl.style.display = "none";
    } else {
      statUl.style.display = "block";
    }
  };

  // Write new status to DB
  changeStatus = ev => {
    this.props.firebase.user(this.userId).child("status").set(ev.target.id)
  };
  
  // Change the status light
  showStatus = () => {
    if (this.state.userData.status === "Invisible") {
      this.statusLight = "rgb(169,169,169)";
      }
    else if(this.state.userData.status === "Idle"){
        this.statusLight = "rgb(222, 216, 27)"
    }
    else if(this.state.userData.status === "Do Not Disturb"){
      this.statusLight = "rgb(255,0,0)"
    } else {
      this.statusLight = "rgb(83, 205, 13)"
    };
  };
  
  showProfile = () => {
    document.getElementById("show-profile").style.display = "block";
  };
  
  componentDidMount(){
    this.fetchUserData();
  };
  
  render() {
    this.showStatus();
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <StyledFlexContainer>
            <StyledCharacter>
              
              <Avatars userId={authUser.uid}/>

              <StyledCharData>
                <h2>{this.state.userData.username}</h2>
                <br />
                <p><i>{this.state.userData.description}</i></p>
                <br />
                <button onClick={this.showProfile}>Edit profile</button>
                <br />

                <button onClick={this.showStatusChoice}>Change status</button>

                <StyledUl id="status-ul" onClick={this.changeStatus}>
                  <li id="Online">Online |</li>
                  <li id="Idle">Idle |</li>
                  <li id="Do Not Disturb">Do Not Disturb |</li>
                  <li id="Invisible">Invisible</li>
                </StyledUl>

              </StyledCharData>

              <Statistics userId={authUser.uid}/>
              
            </StyledCharacter>

            <StyledProfileEdit id="show-profile">
              <h2>{this.state.userData.username}</h2>
              <br />
              <h3>
                <button onClick={this.changeAvatar}>Change Avatar</button>
              </h3>
              <br />
              <h3>Your account: {authUser.email}</h3>
              <br />
              <h3>Password forget</h3>
              <PasswordForgetForm />
              <br />
              <h3>Password change</h3>
              <PasswordChangeForm />
              <LoginManagement authUser={authUser} />
            </StyledProfileEdit>
          </StyledFlexContainer>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

class LoginManagementBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
  };

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then(activeSignInMethods =>
        this.setState({ activeSignInMethods, error: null })
      )
      .catch(error => this.setState({ error }));
  };


  onSocialLoginLink = provider => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onDefaultLoginLink = password => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password
    );

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onUnlink = providerId => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;

    return (
      <div>
        Sign In Methods:
        <ul>
          {SIGN_IN_METHODS.map(signInMethod => {
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(signInMethod.id);

            return (
              <li key={signInMethod.id}>
                {signInMethod.id === "password" ? (
                  <DefaultLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onDefaultLoginLink}
                    onUnlink={this.onUnlink}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnlink={this.onUnlink}
                  />
                )}
              </li>
            );
          })}
        </ul>
        {error && error.message}
      </div>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink
}) =>
  isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <button type="button" onClick={() => onLink(signInMethod.provider)}>
      Link {signInMethod.id}
    </button>
  );

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);

    this.state = { passwordOne: "", passwordTwo: "" };
  }

  onSubmit = event => {
    event.preventDefault();

    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: "", passwordTwo: "" });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { onlyOneLeft, isEnabled, signInMethod, onUnlink } = this.props;

    const { passwordOne, passwordTwo } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return isEnabled ? (
      <button
        type="button"
        onClick={() => onUnlink(signInMethod.id)}
        disabled={onlyOneLeft}
      >
        Deactivate {signInMethod.id}
      </button>
    ) : (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />
        <button disabled={isInvalid} type="submit">
          Link {signInMethod.id}
        </button>
      </form>
    );
  }
}

const LoginManagement = withFirebase(LoginManagementBase);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);