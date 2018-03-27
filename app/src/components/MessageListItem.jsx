import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';

import InboxIcon from 'material-ui-icons/Inbox';
import Badge from 'material-ui/Badge';
import Subheader from 'material-ui/Subheader/Subheader';

import CustomFontIcon from './CustomFontIcon'

import theme from '../styles/theme';
import history from 'utils/history';
import { headerPositions } from '../styles/style'

class MessageListItem extends Component {
  state = {
    backgroundColor: theme.palette.accent2Color,
  };

  setBackgroundColor = color => {
    this.setState({
      backgroundColor: color,
      cursor: 'auto',
    });
  };

  getBackgroundColor = (selectedValue, id) => id == selectedValue ? theme.palette.accent3Color : this.state.backgroundColor;

  setNeutral = () => this.setBackgroundColor(theme.palette.accent2Color);
  setFocus = () => this.setBackgroundColor('#e4e4e4');
  setHover = () => this.setBackgroundColor(theme.palette.accent3Color);

  onClick = (location) => {
    history.push(location)
  }

  onMouseEnter = () => { this.setState({ cursor: 'pointer' }) }
  onMouseLeave = () => { this.setState({ cursor: 'auto' }) }

  render() {
    return (
      <div
        style={{
          ...this.state,
          backgroundColor: this.getBackgroundColor(this.props.selectedValue, this.props.child.id),
          cursor: this.state.cursor,
          alignItems: 'center',
          height: '48px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={() => this.onClick(`${this.props.relativePath}${this.props.child.id}`)}
      >
        <Subheader style={{
          marginLeft: '5px',
          fontSize: '18px',
          color: this.props.child.id == this.props.selectedValue && this.props.gridColumn == 1 ? theme.palette.primary1Color : theme.palette.accent4Color,
        }}>
          {this.props.child.displayName}
        </Subheader>
        {this.props.child.unread > 0 &&
          <Badge style={{ marginTop: '12px', marginRight: '5px' }} badgeContent={this.props.child.unread} secondary={true} badgeStyle={{ backgroundColor: '#439E8E' }} />}
      </div>
    )
  }
}

export default MessageListItem;