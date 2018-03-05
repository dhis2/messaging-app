import React, { Component } from 'react';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

class InboxHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3,
    };
  }

  handleChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <div style={{
        gridRow: 1,
      }}
      >
        {/*<Toolbar style={{alignContent: 'center' }}>
          <IconButton touch={true}>
            <NavigationExpandMoreIcon />
          </IconButton>
          <RaisedButton label="+ New message" primary={true} />
          <RaisedButton label="- Delete" primary={true} />
          </Toolbar>*/}
      </div>
    )
  }
}

export default InboxHeader;