import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';

import PropTypes from 'prop-types';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

import { Router, Route } from 'react-router-dom';
import { compose, lifecycle, pure, branch, getContext, renderComponent } from 'recompose';

import theme from '../styles/theme';
import store from '../store';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const styles = {
    content: {
        paddingTop: '100px',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
    },
};

let ContentLoader = () => (
    <Router history={history}>
        <div style={styles.content}>
            /*<Route exact path="/" component={List} />
            <Route path="/:id" component={EditJob} />*/
        </div>
    </Router>
);

const Messaging = ({ config }) => (
    <Provider store={store}>
        <D2UIApp initConfig={config} muiTheme={theme}>
            <div>
                <HeaderBar />
            </div>
        </D2UIApp>
    </Provider>
);

export default Messaging;
