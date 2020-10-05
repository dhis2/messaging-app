import React from 'react'
import PropTypes from 'prop-types'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import theme from '../../styles/theme'

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
    d2: PropTypes.object,
}

AddD2Context.childContextTypes = {
    d2: PropTypes.object,
}

export default AddD2Context
