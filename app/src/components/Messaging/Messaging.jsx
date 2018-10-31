import React from 'react'
import { Provider } from 'react-redux'

import PropTypes from 'prop-types'
import HeaderBar from '@dhis2/d2-ui-header-bar'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { Router, Route } from 'react-router-dom'
import { Redirect } from 'react-router'

import MessagingCenter from 'components/MessagingCenter/MessagingCenter'
import CustomSnackBar from 'components/Common/CustomSnackBar'
import history from 'utils/history'

import theme from 'styles/theme'
import store from '../../store'

import './index.less'

const ContentLoader = () => (
    <Router history={history}>
        <div>
            <Route
                exact
                path="/"
                component={() => <Redirect to="/PRIVATE" />}
            />
            <Route path="/:messageType" component={MessagingCenter} />
        </div>
    </Router>
)

class AddD2Context extends React.Component {
    getChildContext = () => ({
        d2: this.props.d2,
    })

    render = () => (
        <MuiThemeProvider muiTheme={theme}>
            {this.props.children}
        </MuiThemeProvider>
    )
}

AddD2Context.propTypes = {
    children: PropTypes.object.isRequired,
    d2: PropTypes.object.isRequired,
}

AddD2Context.childContextTypes = {
    d2: PropTypes.object,
}

const Messaging = ({ d2 }) => (
    <Provider store={store}>
        <AddD2Context d2={d2}>
            <div>
                <HeaderBar d2={d2} />
                <CustomSnackBar />
                <ContentLoader />
            </div>
        </AddD2Context>
    </Provider>
)

export default Messaging
