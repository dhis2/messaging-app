import i18n from '@dhis2/d2-i18n'
import Checkbox from 'material-ui/Checkbox'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader/Subheader'
import propTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { setAllChecked, clearCheckedIds } from '../../actions/index.js'
import { fontFamily } from '../../constants/development.js'
import theme from '../../styles/theme.js'

const fontSize = '16px'

const styles = {
    canvas(backgroundColor) {
        return {
            backgroundColor,
            display: 'flex',
            transition: 'all 0.2s ease-in-out',
            boxSizing: 'border-box',
            position: 'relative',
            whiteSpace: 'nowrap',
            alignSelf: 'center',
            boxShadow: 'none',
            borderBottom: '1px solid #dfdfdf',
        }
    },
    checkBox: {
        flex: '0 0 32px',
        display: 'flex',
        alignSelf: 'center',
        paddingLeft: '12px',
    },
    sender: {
        fontFamily,
        fontSize,
        flex: 3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: 'black',
        paddingLeft: 10,
        alignSelf: 'center',
    },
    subject: {
        flex: 8,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily,
        fontSize,
        color: 'black',
        paddingLeft: 10,
    },
    extendedLabel: {
        flex: 2,
        color: 'black',
        fontSize,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        padding: '0 0 0 10px',
    },
}

class MessageConversationListItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cursor: 'auto',
            allChecked: false,
        }
    }

    componentDidUpdate() {
        if (
            this.state.allChecked &&
            this.props.checkedIds.length < this.props.messages.length
        ) {
            this.setState({ allChecked: false })
        }
    }

    render() {
        const displayExtendedChoices = this.props.displayExtendedChoices

        return (
            <Paper style={styles.canvas(theme.palette.canvasColor)}>
                <Checkbox
                    checked={this.state.allChecked}
                    style={styles.checkBox}
                    onCheck={() => {
                        this.state.allChecked
                            ? this.props.clearCheckedIds()
                            : this.props.setAllChecked(
                                  this.props.messages.map((child) => ({
                                      id: child.id,
                                  }))
                              )

                        this.setState({ allChecked: !this.state.allChecked })
                    }}
                />
                <div style={styles.sender}>{i18n.t('Sender')}</div>
                <Subheader style={styles.subject}>
                    {i18n.t('Subject')}
                </Subheader>
                {displayExtendedChoices && (
                    <Subheader style={styles.extendedLabel}>
                        {i18n.t('Status')}
                    </Subheader>
                )}
                {displayExtendedChoices && (
                    <Subheader style={styles.extendedLabel}>
                        {i18n.t('Priority')}
                    </Subheader>
                )}
                {this.props.notification && (
                    <Subheader style={styles.extendedLabel}>
                        {i18n.t('Assignee')}
                    </Subheader>
                )}
                <Subheader style={styles.extendedLabel}>
                    {i18n.t('Date')}
                </Subheader>
            </Paper>
        )
    }
}

MessageConversationListItem.propTypes = {
    checkedIds: propTypes.array,
    clearCheckedIds: propTypes.func,
    displayExtendedChoices: propTypes.bool,
    messages: propTypes.array,
    notification: propTypes.bool,
    setAllChecked: propTypes.func,
}

const mapStateToProps = (state) => ({
    checkedIds: state.messaging.checkedIds,
    isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
})

export default compose(
    connect(mapStateToProps, {
        setAllChecked,
        clearCheckedIds,
    })
)(MessageConversationListItem)
