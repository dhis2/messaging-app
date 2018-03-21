import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';

import InboxIcon from 'material-ui-icons/Inbox';
import Badge from 'material-ui/Badge';
import MarkUnreadIcon from 'material-ui-icons/Mail';


import theme from '../styles/theme';

class MessageListItem extends Component {
  state = {
    backgroundColor: theme.palette.accent2Color,
  };

  setBackgroundColor = color => {
    this.setState({
      backgroundColor: color,
    });
  };

  getBackgroundColor = (selectedValue, id) => id == selectedValue ? theme.palette.accent3Color : this.state.backgroundColor;

  setNeutral = () => this.setBackgroundColor(theme.palette.accent2Color);
  setFocus = () => this.setBackgroundColor('#e4e4e4');
  setHover = () => this.setBackgroundColor(theme.palette.accent3Color);

  markUnreadComponent = (child, selectedValue, markUnread) => (
    <MarkUnreadIcon 
    style={{
      cursor: 'pointer'
    }}
    onClick={(event) => {
      event.stopPropagation()
      event.preventDefault()

      selectedValue != child.id && markUnread(child)
    }} />
  )

  render() {
    const rightIcon = this.props.gridColumn == 1 ? this.props.child.unread > 0 ?
      <Badge badgeContent={this.props.child.unread} secondary={true} badgeStyle={{ backgroundColor: '#439E8E' }} /> : undefined
      :
      this.markUnreadComponent(this.props.child, this.props.selectedValue, this.props.markUnread);

    return (
      <Link
        style={{
          ...this.state,
          textDecoration: 'none',
        }}
        to={`${this.props.relativePath}${this.props.child.id}`}
      >
          <ListItem
            touchRippleColor={theme.palette.primary2Color}
            style={{
              borderLeftStyle: !this.props.child.read && this.props.gridColumn == 2 ? 'solid' : '',
              borderLeftWidth: '5px',
              borderLeftColor: theme.palette.primary1Color,
              backgroundColor: this.getBackgroundColor(this.props.selectedValue, this.props.child.id),
              color: this.props.child.id == this.props.selectedValue && this.props.gridColumn == 1 ? theme.palette.primary1Color : theme.palette.textColor,
              fontSize: '15px',
            }}
            rightIcon={rightIcon}
            primaryText={this.props.child.displayName}
            secondaryText={this.props.gridColumn == 2 &&
              <p>
                <span style={{ color: theme.palette.textColor }}>
                  {this.props.messageType != 'PRIVATE' ? this.props.messageType : this.props.child.lastSenderFirstname + ' ' + this.props.child.lastSenderSurname}
                </span> -- {' ' + this.props.child.subject}
              </p>
            }
            secondaryTextLines={1}
          />
      </Link>
    )
  }
}

export default MessageListItem;