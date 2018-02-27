import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar'

class MessagingCenter extends Component {
  state = {

  };

  componentWillReceiveProps = () => {
  };

  render = () => (
    <div style={{ height: '100vh', width: '100vw' }}>
        <Sidebar />
    </div>
  );
}

export default connect(state => ({
}))(MessagingCenter);