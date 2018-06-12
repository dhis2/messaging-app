import React from 'react';
import { Provider } from 'react-redux';

import PropTypes from 'prop-types';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';

import MessagingCenter from 'components/MessagingCenter';
import CustomSnackBar from 'components/CustomSnackBar';
import history from 'utils/history';

import theme from '../styles/theme';
import store from '../store';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const ContentLoader = () => (
    <Router history={history}>
        <div>
            <Route exact path="/" component={() => <Redirect to="/PRIVATE" />} />
            <Route path="/:messageType" component={MessagingCenter} />
        </div>
    </Router>
);

class AddD2Context extends React.Component {
    getChildContext = () => ({
        d2: this.props.d2,
    });

    render = () => <MuiThemeProvider muiTheme={theme}>{this.props.children}</MuiThemeProvider>;
}

AddD2Context.propTypes = {
    children: PropTypes.object.isRequired,
    d2: PropTypes.object.isRequired,
};

AddD2Context.childContextTypes = {
    d2: PropTypes.object,
};

const Messaging = ({ d2 }) => (
    <Provider store={store}>
        <AddD2Context d2={d2}>
            <div>
                <HeaderBar />
                <CustomSnackBar />
                <ContentLoader />
            </div>
        </AddD2Context>
    </Provider>
);

export default Messaging;
