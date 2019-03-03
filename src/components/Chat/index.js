import React, { Component } from "react";
import { compose } from "recompose";

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";

import Styled from "styled-components";

/*** STYLED COMPONENETS ***/
const StyledChat = Styled.section`
    flex-basis: 100%;
    min-width: 332px;
    min-height: 292px;
    max-height: 500px;
    padding: 12px;
    border: 1px solid rgb(177,177,177);
    border-top: none;
    margin-bottom: 32px;
    & h2 {
        color: rgb(29, 134, 226);
        text-shadow: 1px 1px 0.5px rgb(252,252,252);
        margin-bottom: 12px;
    }
    @media (max-width: 767px) {
        flex-basis: 100%;
        padding: 12px;
    }
`;
const StyledMessageBox = Styled.div`  
  max-width: 642px;  
  background-color: rgb(37,37,37);
  color: rgb(244,244,244);
  padding: 4px;  
  border: 2px solid rgb(206,202,202);
  & ul {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 220px;
  }  
  @media (max-width: 767px) {
    max-width: 330px;
  }
`;
const StyledInput = Styled.input`
    background-color: rgb(249, 249, 249);
    padding: 6px;  
    margin: 0;
`;
const StyledSubmit = Styled.button`    
    background-color: rgb(47,47,47);
    margin-left: 8px;
`;
/*** END ***/

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null
    };
  }

  componentDidMount() {
    this.props.firebase.users().on("value", snapshot => {
      this.setState({
        users: snapshot.val()
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    return (
      <div>
        <Messages users={this.state.users} />
      </div>
    );
  }
}

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      loading: false,
      messages: [],
      limit: 8
    };
  }

  componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages = () => {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .orderByChild("createdAt")
      .limitToLast(this.state.limit)
      .on("value", snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key
          }));

          this.setState({
            messages: messageList,
            loading: false
          });
        } else {
          this.setState({ messages: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP
    });

    this.setState({ text: "" });
    event.preventDefault();
  };

  onEditMessage = (message, text) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP
    });
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages
    );
  };

  render() {
    const { users } = this.props;
    const { text, messages, loading } = this.state;
    
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <br />
            {loading && <div>Loading ...</div>}

            <StyledMessageBox>
              {messages && (
                <MessageList                  
                  messages={messages.map(message => ({
                    ...message,
                    user: users
                      ? users[message.userId]
                      : { userId: message.userId },                    
                    isOwned: authUser.uid === message.userId ? true : false
                  }))}
                  //onEditMessage={this.onEditMessage}
                  //onRemoveMessage={this.onRemoveMessage}
                />
              )}
            </StyledMessageBox>

            {!messages && <div>There are no messages ...</div>}

            <form onSubmit={event => this.onCreateMessage(event, authUser)}>
              <StyledInput
                maxLength="64"
                type="text"
                value={text}
                onChange={this.onChangeText}
              />
              <StyledSubmit type="submit">Send</StyledSubmit>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const MessageList = ({
  messages
  //onEditMessage,
  //onRemoveMessage,
}) => (
  <ul>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        message={message}       
        //onEditMessage={onEditMessage}
        //onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);


class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text
    }));
  };

  onChangeEditText = e => {
    this.setState({ editText: e.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);
    this.setState({ editMode: false });
  };

  
  render() {
    const { message, onRemoveMessage } = this.props;    
    //const msgId = this.props.message.userId;    
    const msgOwn = this.props.message.isOwned;    
    const { editMode, editText } = this.state;
    const styles = {
      color: "rgb(226, 150, 55)"
    };
    
    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>   
            { msgOwn ? <strong style={styles}>{message.user.username} </strong> : <strong>{message.user.username} </strong> }             
            {message.text} 
          </span>
        )}
      </li>
    );
  }
}

const Messages = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition)
)(Chat);
