import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import CustomDrawer from './CustomDrawer';

class MessagingCenter extends Component {
  state = {

  } 

  render = () => (
    <div style={{ 
        display: 'flex',
        flexDirection: 'row',
    }}>
        {console.log(this.props)}
        <CustomDrawer drawerLevel={0} props={this.props} children={messageTypes} open={true} />
        <CustomDrawer drawerLevel={1} props={this.props} children={messageTypes} open={true} />
    </div>
  );
}

export default compose(
  connect(
    state => {
      return {
        open: true,
      };
    },
    dispatch => ({
    }),
  ),
  pure,
)(MessagingCenter);