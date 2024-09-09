import { useConfig } from '@dhis2/app-runtime'
import cx from 'classnames'
import { CircularProgress } from 'material-ui'
import propTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import '../../locales/index.js'
import { setCurrentUser, setDhis2CoreVersion } from '../../actions/index.js'
import CustomSnackBar from '../Common/CustomSnackBar.js'
import classes from './App.module.css'
import Routes from './Routes.js'

const App = ({ currentUser, setCurrentUser, setDhis2CoreVersion }) => {
    const { loading, error } = currentUser
    const { serverVersion } = useConfig()

    useEffect(() => {
        setDhis2CoreVersion(serverVersion.minor)
        setCurrentUser()
    }, [])

    if (loading) {
        return (
            <div className={classes.center}>
                <CircularProgress size={48} />
            </div>
        )
    }

    if (error) {
        return <div className={cx(classes.center, classes.error)}>{error}</div>
    }

    return (
        <div>
            <CustomSnackBar />
            <Routes />
        </div>
    )
}

App.propTypes = {
    currentUser: propTypes.object.isRequired,
    setCurrentUser: propTypes.func.isRequired,
    setDhis2CoreVersion: propTypes.func.isRequired,
}

export default connect(
    (state) => ({
        currentUser: state.messaging.currentUser,
    }),
    {
        setCurrentUser,
        setDhis2CoreVersion,
    }
)(App)
