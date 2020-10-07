import React, { Component } from 'react'
import propTypes from '@dhis2/prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'
import { CircularProgress } from 'material-ui'

import CustomSnackBar from '../Common/CustomSnackBar'
import Routes from './Routes'
import { setCurrentUser } from '../../actions'

import classes from './App.module.css'

class App extends Component {
    componentDidMount() {
        this.props.setCurrentUser()
    }

    render() {
        const { loading, error } = this.props.currentUser

        if (loading) {
            return (
                <div className={classes.center}>
                    <CircularProgress size={48} />
                </div>
            )
        }

        if (error) {
            return (
                <div className={cx(classes.center, classes.error)}>{error}</div>
            )
        }

        return (
            <div>
                <CustomSnackBar />
                <Routes />
            </div>
        )
    }
}

App.propTypes = {
    currentUser: propTypes.object.isRequired,
    setCurrentUser: propTypes.func.isRequired,
}

export default connect(
    state => ({
        currentUser: state.messaging.currentUser,
    }),
    {
        setCurrentUser,
    }
)(App)
