import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import Styled from 'styled-components';

/*** STYLED COMPONENTS ***/
const StyledTitle = Styled.h1`
    font-size: 2em;
    color: rgb(35, 123, 226);
`;
/*** END ***/


class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const { users, loading } = this.state;
        return (
            <div>
                <br />
                <StyledTitle>Admin</StyledTitle><br />
                <h3>Logged in users</h3>
                {loading && <div>Loading ...</div>}
                <UserList users={users} />
            </div>
        );
    }
}

const UserList = ({ users }) => (
    <React.Fragment>
        <br />
        <ul>
            {users.map(user => (
                <li key={user.uid}>
                    <span>
                        <strong>ID:</strong> {user.uid}
                    </span>
                    <span>
                        <strong>E-Mail:</strong> {user.email}
                    </span>
                    <span>
                        <strong>Username:</strong> {user.username}
                    </span>
                </li>
            ))}
        </ul>
    </React.Fragment>
);

const condition = authUser =>
    authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
    withEmailVerification,
    withAuthorization(condition),
    withFirebase,
)(AdminPage);