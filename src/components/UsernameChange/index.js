import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class UsernameChangeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSubmit = event => {
        this.props.firebase.user(this.props.authUser.uid).child("username").set(this.state.username)
        .then(() => {
            this.setState({username: ""});
        });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    minLength="3"
                    maxLength="15"
                    name= "username"
                    value= {this.state.username}
                    onChange={this.onChange}
                    type="text"
                    placeholder={this.props.authUser.username}
                />

                <button type="submit">
                    Change username
                </button>
            </form>
        );
    }
}

export default withFirebase(UsernameChangeForm);