import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';

import InboxIcon from 'material-ui-icons/Inbox';
import Badge from 'material-ui/Badge';

import CustomFontIcon from './CustomFontIcon'

import theme from '../styles/theme';
import { headerPositions } from '../styles/style'

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

  render() {
    const rightIcon = this.props.gridColumn == 1 ? this.props.child.unread > 0 ?
      <Badge style={{ marginTop: '12px', marginRight: '5px' }} badgeContent={this.props.child.unread} secondary={true} badgeStyle={{ backgroundColor: '#439E8E' }} /> : undefined
      :
      <CustomFontIcon child={this.props.child} selectedValue={this.props.selectedValue} onClick={this.props.markUnread} icon={'markunread'}/>

    return (
      <Link
        style={{
          ...this.state,
          backgroundColor: this.getBackgroundColor(this.props.selectedValue, this.props.child.id),          
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          textDecoration: 'none',
        }}
        to={`${this.props.relativePath}${this.props.child.id}`}
      >
          <ListItem
            touchRippleColor={theme.palette.primary2Color}
            style={{
              borderLeftStyle: !this.props.child.read && this.props.gridColumn == 2 ? 'solid' : '',
              borderLeftWidth: '3px',
              borderLeftColor: theme.palette.primary1Color,
              color: this.props.child.id == this.props.selectedValue && this.props.gridColumn == 1 ? theme.palette.primary1Color : theme.palette.textColor,
              fontSize: '15px',
            }}
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
          {rightIcon}
      </Link>
    )
  }
}

export default MessageListItem;