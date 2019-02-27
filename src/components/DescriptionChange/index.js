import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class DescriptionChangeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
        };
    }


    
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value })
        this.props.firebase.user(this.props.userId).child("description").set(this.state.description)
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name= "description"
                    value= {this.state.description}
                    onChange={this.onChange}
                    type="text"
                />
            </form>
        );
    };
};

export default withFirebase(DescriptionChangeForm);