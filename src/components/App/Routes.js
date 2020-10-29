import { Router, Route } from 'react-router-dom'
import { Redirect } from 'react-router'
import React from 'react'
import MessagingCenter from '../MessagingCenter/MessagingCenter.js'
import history from '../../utils/history.js'

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
