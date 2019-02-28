import React, { Component } from 'react';
import { compose } from 'recompose';

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { withFirebase } from '../Firebase';

import Styled from 'styled-components';


/*** STYLED COMPONENETS ***/
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
      users: null,
    };
  }

  componentDidMount() {
    this.props.firebase.users().on('value', snapshot => {
      this.setState({
        users: snapshot.val(),
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
      text: '',
      loading: false,
      messages: [],
      limit: 8,
    };
  }

  componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages = () => {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .orderByChild('createdAt')
      .limitToLast(this.state.limit)
      .on('value', snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key,
          }));

          this.setState({
            messages: messageList,
            loading: false,
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
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ text: '' });
    event.preventDefault();
  };

  onEditMessage = (message, text) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages,
    );
  };

  render() {
    const { users } = this.props;    
    const { text, messages, loading } = this.state;
    const styles = {
      color: "red"
    }

    return (
      
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            
            {loading && <div>Loading ...</div>}

            <StyledMessageBox>
              {messages && (
                <MessageList style={styles}
                  messages={messages.map(message => ({
                    ...message,
                    //...message.userId.style.color = "blue",
                    user: users
                      ? users[message.userId]
                      : { userId: message.userId },
                  }))}
                  //onEditMessage={this.onEditMessage}
                  //onRemoveMessage={this.onRemoveMessage}
                />
              )}
            </StyledMessageBox>


            {!messages && <div>There are no messages ...</div>}


            <form
              onSubmit={event =>
                this.onCreateMessage(event, authUser)
              }
            >  

              <StyledInput maxLength="64"
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
  messages,
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
      editText: this.props.message.text,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

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
              <strong>
                {message.user.username || message.user.userId}
              </strong>{' '}
              {message.text} {message.editedAt && <span>(Edited)</span>}
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
  withAuthorization(condition),
)(Chat);

