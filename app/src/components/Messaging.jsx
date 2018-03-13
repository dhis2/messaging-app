import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';

import PropTypes from 'prop-types';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

import { Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { compose, lifecycle, pure, branch, getContext, renderComponent } from 'recompose';

import MessagingCenter from 'components/MessagingCenter';
import * as actions from 'constants/actions';
import initializeI18n from 'utils/i18n';
import history from 'utils/history';

import theme from '../styles/theme';
import store from '../store';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

let ContentLoader = () => (
    <Router history={history}>
        <div>
            <Route exact path="/" component={() => <Redirect to="/PRIVATE" />}/>
            <Route path="/:messageType" component={MessagingCenter} />
        </div>
    </Router>
);

const Messaging = ({ config }) => (
    <Provider store={store}>
        <D2UIApp initConfig={config} muiTheme={theme}>
            <HeaderBar />
            <ContentLoader />
        </D2UIApp>
    </Provider>
);

export default Messaging;
