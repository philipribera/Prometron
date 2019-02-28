import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
//import { isNullOrUndefined } from 'util';

const styles = {
    display: "inline"
}

class DescriptionChangeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            // ADDED, PR
            userData: {},
            edit: false
        };       
    }

    onSubmit = (e) => {
        this.props.firebase.user(this.props.userId).child("description").set(this.state.description)
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        
    };

    // render usernamechange component
    changeDesc = (e) => {
        let inputValue = document.getElementById('input-desc').value;        
        this.state.edit ? this.setState({ edit: false }) : this.setState({ edit: true });
        this.setState({ description: inputValue });        
    };

    componentWillUnmount() {
        this.props.firebase.user(this.props.userId).child("description").set(this.state.description);
    }
        
    render() {
        return (
            <form onSubmit={this.onSubmit} style={styles}>
                <input id="input-desc" maxLength="18"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                    type="text"
                />                
            </form>
        );
    };
};

export default withFirebase(DescriptionChangeForm);