import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import InboxIcon from 'material-ui-icons/Inbox';

import theme from '../styles/theme';

const CustomDrawer = ({drawerLevel, props, open, children}) => {
  const routeValue = drawerLevel == 0 ? props.match.params.messageType : props.match.params.messageConversationId;
  const linkToPath = drawerLevel == 0 ? "/" : "/" + props.match.params.messageType + "/";

  return (
    <div >
        <Drawer containerStyle={{left: (drawerLevel * 256) + 'px', height: 'calc(100% - 49px)', top: 49}} open={open}>
          <Menu selectedMenuItemStyle={{backgroundColor: theme.palette.primary2Color, color: theme.palette.primary3Color}}
            value={routeValue}>
            {
              children.map( child => {
                return <MenuItem
                          key={child.key}
                          value={child.key}
                          leftIcon={
                            <InboxIcon/>
                          }
                          primaryText={child.text}
                          containerElement={ <Link to={linkToPath + child.key} /> }
                        />
              })
            }
          </Menu>
        </Drawer>
    </div>
  );
}

export default CustomDrawer;