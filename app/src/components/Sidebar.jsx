import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import Button from './Button'
import { colors, fonts } from '../styles/theme.js'
import messageTypes from '../constants/messageTypes'

import * as actions from 'constants/actions';

class Sidebar extends Component {
  render() {
    console.log(this)
    return (
      <div style={{
        backgroundColor: '#f4f4f4',
        display: 'flex',
        flexDirection: 'column',
        width: '200px',
        height: '100%',
        zIndex: 1,
      }}>
        <MessageTypeList
          onClick={(messageType) => this.props.toggleMessageType(messageType)}
          selectedMessageType={this.props.selectedMessageType}
          messageTypes={messageTypes}
        />
      </div>
    );
  }
}
  
const MessageTypeList = ({ selectedMessageType, onClick, messageTypes }) => {
  return (
    <div>
      <h2 style={{ fontWeight: 400, fontSize: fonts.large }} />
      <div style={{
        overflow: 'scroll',
      }}>
        {
          messageTypes.map(messageType =>
            <MessageTypeUnit
              key={messageType.key}
              onClick={() => onClick(messageType)}
              selected={(messageType.key == selectedMessageType) ? true : false}
              displayName={messageType}
            />
          )
        }
      </div>
    </div>
  )
}

const doNothing = () => { }

const MessageTypeUnit = ({ displayName, onClick, selected }) => {
  return (
    <div style={{ marginTop: 4 }}>
      <Button color="#841584"
        onClick={selected ? doNothing : () => onClick()}
        text={displayName}
        selected={selected} />
    </div>
  )
}

const enhance = compose(
  connect(
    state => {
      return {
        selectedMessageType: state.message.selectedMessageType,
      };
    },
    dispatch => ({
      toggleMessageType: messageType => dispatch({ type: actions.TOGGLE_MESSAGE_TYPE, payload: { messageType } }),
    }),
  ),
  pure,
);

export default enhance(Sidebar);