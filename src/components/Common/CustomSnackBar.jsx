import React, { Component } from 'react'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'
import { clearSnackMessage } from '../../actions'
import { compose, pure } from 'recompose'
import theme from '../../styles/theme'

const DEFAULT_MESSAGE_DURATION = 4000
const contentColorStyle = {
    NEGATIVE: theme.palette.negative,
    NEUTRAL: theme.palette.primary1Color,
    POSITIVE: theme.palette.alternateTextColor,
}

class CustomSnackBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false,
        }
    }

    componentDidUpdate(_prevProps, prevState) {
        if (!prevState.show && this.props.message) {
            this.setState({
                show: true,
            })
        }
    }

    closeMessage = () => {
        this.props.clearSnackMessage()
        this.setState({
            show: false,
        })
        this.props.onSnackRequestClose && this.props.onSnackRequestClose()
    }

    render() {
        return (
            <Snackbar
                open={this.props.message !== '' && this.state.show}
                message={this.props.message || 'Missing snackbar message'}
                autoHideDuration={DEFAULT_MESSAGE_DURATION}
                onRequestClose={this.closeMessage}
                action={this.props.onSnackActionClick && 'undo'}
                onActionClick={() => {
                    this.props.onSnackActionClick()
                    this.setState({
                        show: false,
                    })
                }}
                contentStyle={{ color: contentColorStyle[this.props.type] }}
                style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
                bodyStyle={{ pointerEvents: 'initial', maxWidth: 'none' }}
            />
        )
    }
}

const mapStateToProps = state => ({
    message: state.messaging.snackMessage,
    type: state.messaging.snackType,
    onSnackActionClick: state.messaging.onSnackActionClick,
    onSnackRequestClose: state.messaging.onSnackRequestClose,
})

export default compose(
    connect(mapStateToProps, {
        clearSnackMessage,
    }),
    pure
)(CustomSnackBar)
