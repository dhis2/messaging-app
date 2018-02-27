import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';

import PropTypes from 'prop-types';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

import { Router, Route } from 'react-router-dom';
import { compose, lifecycle, pure, branch, getContext, renderComponent } from 'recompose';

import MessagingCenter from 'components/MessagingCenter';
import * as actions from 'constants/actions';
import history from 'utils/history';

import theme from '../styles/theme';
import { accent3Color } from 'material-ui/styles/colors';
import store from '../store';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const styles = {
    content: {
        paddingTop: '40px',
        width: '100%',
        margin: '0 auto',
    },
};

let ContentLoader = () => (
    <Router history={history}>
        <div style={styles.content}>
            <Route exact path="/" component={MessagingCenter} />
        </div>
    </Router>
);

const Messaging = ({ config }) => (
    <Provider store={store}>
        <D2UIApp initConfig={config} muiTheme={theme}>
            <div>
                <HeaderBar />
                <ContentLoader />
            </div>
        </D2UIApp>
    </Provider>
);

export default Messaging;
