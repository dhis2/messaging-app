import React, { Component } from 'react';

import { List, ListItem } from 'material-ui/List';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import IconButton from 'material-ui/IconButton';
import Expand from 'material-ui-icons/ExpandMore';
import DeExpand from 'material-ui-icons/ExpandLess';

import ReplyCard from './ReplyCard'

import { cardStyles, messagePanelContainer } from '../styles/style';
const moment = require('moment');

class MessageConversation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: props.messageConversation.id,
      expanded: props.expanded != undefined ? props.expanded : true
    }
  }

  state = {
    expanded: true,
  }

  handleExpandChange = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  /*componentDidUpdate = () => {
    var elem = document.getElementById( this.state.id ); 
    var list = document.getElementById( 'fullWidthList' ); 
    list.scrollTop = elem.offsetTop - '95';
  };*/

  render() {
    const messageConversation = this.props.messageConversation;

    const messages = this.state.expanded ? messageConversation.messages : messageConversation.messages.slice(0, 1)
    return (
      <div style={{
          marginTop: this.state.expanded ? '20px' : '',  
          marginBottom: this.state.expanded ? '20px' : '5px',
          marginLeft: this.state.expanded ? '10px' : '25px',
          marginRight: this.state.expanded ? '10px' : '25px',
        }}
        id={messageConversation.id}>
        <List style={{ padding: '0px' }}>
          {messages.map(message => {
            const title = messageConversation.messageType == 'PRIVATE' ? message.sender.displayName : messageConversation.messageType;
            return (
              <div key={message.id}>
                <Card 
                  style={cardStyles.cardItem} 
                  key={message.id}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}>
                    <CardHeader
                      title={title}
                      subtitle={moment(message.lastUpdated).format('ddd DD/MM/YYYY HH:mm')}
                    />
                    {(message.id == messages[0].id && this.props.showExpandButton) && <IconButton
                      tooltip={ this.state.expanded ? "Less" : "More" }
                      tooltipPosition="bottom-left"
                      style={{
                        marginRight: '5px',
                        marginTop: '5px'
                      }} 
                      onClick={this.handleExpandChange}
                    >
                      {this.state.expanded ? 
                        <DeExpand />
                        :
                        <Expand />}
                    </IconButton>}
                  </div>
  
                  <CardText style={{
                    overflow: this.state.expanded ? 'auto' : 'hidden',
                    textOverflow: this.state.expanded ? 'initial' : 'ellipsis',
                    whiteSpace: this.state.expanded ? 'normal' : 'nowrap',
                  }}>
                    {message.text}
                  </CardText>
                </Card>
              </div>
            )
          })
          }
        </List>
        {((messageConversation.messageType == 'PRIVATE' || messageConversation.messageType == 'TICKET') && this.state.expanded) && 
        <ReplyCard messageConversation={messageConversation} />}
      </div>
    )
  }
}

export default MessageConversation