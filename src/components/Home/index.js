import React from 'react';
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization, withEmailVerification } from "../Session";
import LocatedTwo from '../GeolocatedTwo'

const HomePage = (props) => (
    <AuthUserContext.Consumer>
{authUser =>
    <div>
        <h1>Home Page{authUser.email}</h1>
        <LocatedTwo userId={authUser.uid} />
        <p>The Home Page is accessible by every signed in user.</p>
    </div>
    }
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

//export default withAuthorization(condition)(HomePage);
export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition)
  )(HomePage);