import React from 'react'
import { Redirect } from 'react-router'
import { Router, Route } from 'react-router-dom'
import history from '../../utils/history.js'
import MessagingCenter from '../MessagingCenter/MessagingCenter.jsx'

const Routes = () => (
    <Router history={history}>
        <div>
            <Route
                exact
                path="/"
                component={() => <Redirect to="/PRIVATE" />}
            />
            <Route
                path="/:messageType/:messageId?/:recipientId?"
                component={MessagingCenter}
            />
        </div>
    </Router>
)

export default Routes
