import React, { Component } from 'react'
import propTypes from '@dhis2/prop-types'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import Assignment from 'material-ui-icons/Assignment'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Delete from 'material-ui-icons/Delete'
import MarkUnread from 'material-ui-icons/Markunread'
import Done from 'material-ui-icons/Done'
import i18n from '@dhis2/d2-i18n'
import {
    clearCheckedIds,
    clearSelectedMessageConversation,
    deleteMessageConversations,
    updateMessageConversations,
    markMessageConversations,
} from '../../actions/index.js'
import extendedChoices from '../../constants/extendedChoices.js'
import history from '../../utils/history.js'
import AssignToDialog from './AssignToDialog.js'
import DialogWithReduxState from './DialogWithReduxState.js'

const multiSelectDisplayLimit = 99

const styles = {
    canvas: {
        width: '400px',
        display: 'flex',
    },
    extendedChoices: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
    nrSelected: {
        padding: '0px 0px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}

class ToolbarExtendedChoicePicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            checkedItems: false,
            dialogOpen: false,
            assignToOpen: false,
        }
    }

    getIds = () =>
        this.props.selectedMessageConversation &&
        this.props.checkedIds.length === 0
            ? [this.props.selectedMessageConversation.id]
            : this.props.checkedIds.map(id => id.id)

    updateMessageConversation = (identifier, value) => {
        const {
            selectedMessageType: messageType,
            selectedMessageConversation,
        } = this.props
        const messageConversationIds = this.getIds()

        this.props.updateMessageConversations({
            messageConversationIds,
            identifier,
            value,
            messageType,
            selectedMessageConversation,
        })
        this.props.checkedIds.length > 0 && this.props.clearCheckedIds()
    }

    markMessageConversations = mode => {
        const ids = this.getIds()
        this.props.markMessageConversations(
            mode,
            ids,
            this.props.selectedMessageType
        )
        this.props.checkedIds.length > 0 && this.props.clearCheckedIds()
    }

    toggleDialog = () => {
        this.setState({ dialogOpen: !this.state.dialogOpen })
    }

    render() {
        const messageConversation = this.props.selectedMessageConversation
        const multiSelect = this.props.checkedIds.length > 0
        const display = multiSelect || messageConversation !== undefined

        const actionButtons = (
            <>
                <FlatButton
                    label={i18n.t('Cancel')}
                    primary
                    onClick={() => this.toggleDialog()}
                />
                <FlatButton
                    label={i18n.t('Submit')}
                    primary
                    keyboardFocused
                    onClick={() => {
                        this.props.deleteMessageConversations(
                            this.getIds(),
                            this.props.selectedMessageType
                        )
                        this.props.clearCheckedIds()
                        this.toggleDialog()

                        if (this.props.selectedMessageConversation) {
                            this.props.clearSelectedMessageConversation()
                            history.push(
                                `/${this.props.selectedMessageType.id}`
                            )
                        }
                    }}
                />
            </>
        )

        const displayNumberOfCheckedIds =
            this.props.checkedIds.length > multiSelectDisplayLimit
                ? `${multiSelectDisplayLimit}+`
                : this.props.checkedIds.length

        return display ? (
            <div style={styles.canvas}>
                <DialogWithReduxState
                    title={i18n.t(
                        'Are you sure you want to delete selected message conversation(s)?'
                    )}
                    actions={actionButtons}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.toggleDialog}
                />
                <AssignToDialog
                    open={this.state.assignToOpen}
                    onRequestClose={() =>
                        this.setState({
                            assignToOpen: !this.state.assignToOpen,
                        })
                    }
                    updateMessageConversations={id =>
                        this.updateMessageConversation('ASSIGNEE', id)
                    }
                    messageType={this.props.selectedMessageType}
                    feedbackRecipientsId={this.props.feedbackRecipientsId}
                />

                <div style={styles.extendedChoices}>
                    <IconButton
                        tooltip={i18n.t('Delete selected')}
                        onClick={() => {
                            this.toggleDialog()
                        }}
                    >
                        <Delete />
                    </IconButton>

                    <IconButton
                        tooltip={i18n.t('Mark selected as unread')}
                        onClick={() => {
                            this.markMessageConversations('unread')
                        }}
                    >
                        <MarkUnread />
                    </IconButton>

                    <IconButton
                        tooltip={i18n.t('Mark selected as read')}
                        onClick={() => {
                            this.markMessageConversations('read')
                        }}
                    >
                        <Done />
                    </IconButton>
                    {this.props.displayExtendedChoices && (
                        <IconButton
                            onClick={() =>
                                this.setState({
                                    assignToOpen: !this.state.assignToOpen,
                                })
                            }
                            tooltip={i18n.t('Assign selected')}
                        >
                            <Assignment />
                        </IconButton>
                    )}
                    {
                        <IconMenu
                            iconButtonElement={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            anchorOrigin={{
                                horizontal: 'left',
                                vertical: 'top',
                            }}
                            targetOrigin={{
                                horizontal: 'left',
                                vertical: 'top',
                            }}
                        >
                            <MenuItem
                                key={'markFollowUp'}
                                value={'markFollowUp'}
                                primaryText={i18n.t('Mark for followup')}
                                onClick={() =>
                                    this.updateMessageConversation(
                                        'FOLLOW_UP',
                                        true
                                    )
                                }
                            />
                            <MenuItem
                                key={'clearFollowUp'}
                                value={'clearFollowUp'}
                                primaryText={i18n.t('Clear followup')}
                                onClick={() =>
                                    this.updateMessageConversation(
                                        'FOLLOW_UP',
                                        false
                                    )
                                }
                            />
                            {this.props.displayExtendedChoices && <Divider />}
                            {this.props.displayExtendedChoices && (
                                <MenuItem
                                    key={'clearAssigned'}
                                    value={'clearAssigned'}
                                    primaryText={i18n.t('Clear assignee')}
                                    onClick={() =>
                                        this.updateMessageConversation(
                                            'ASSIGNEE',
                                            undefined
                                        )
                                    }
                                />
                            )}
                            {this.props.displayExtendedChoices && (
                                <MenuItem
                                    primaryText={i18n.t('Set status')}
                                    key={'setStatus'}
                                    rightIcon={<ArrowDropRight />}
                                    menuItems={extendedChoices.STATUS.map(
                                        elem => (
                                            <MenuItem
                                                key={`${elem.key}_status`}
                                                value={elem.value}
                                                primaryText={elem.primaryText}
                                                onClick={() =>
                                                    this.updateMessageConversation(
                                                        'STATUS',
                                                        elem.key
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                />
                            )}
                            {this.props.displayExtendedChoices && (
                                <MenuItem
                                    primaryText={i18n.t('Set priority')}
                                    key={'setPriority'}
                                    rightIcon={<ArrowDropRight />}
                                    menuItems={extendedChoices.PRIORITY.map(
                                        elem => (
                                            <MenuItem
                                                key={`${elem.key}_priority`}
                                                value={elem.value}
                                                primaryText={elem.primaryText}
                                                onClick={() =>
                                                    this.updateMessageConversation(
                                                        'PRIORITY',
                                                        elem.key
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                />
                            )}
                        </IconMenu>
                    }
                </div>
                {multiSelect && (
                    <Subheader style={styles.nrSelected}>
                        {`${displayNumberOfCheckedIds} ${i18n.t('selected')}`}
                    </Subheader>
                )}
            </div>
        ) : (
            <div />
        )
    }
}

ToolbarExtendedChoicePicker.propTypes = {
    checkedIds: propTypes.array,
    clearCheckedIds: propTypes.func,
    clearSelectedMessageConversation: propTypes.func,
    deleteMessageConversations: propTypes.func,
    displayExtendedChoices: propTypes.bool,
    feedbackRecipientsId: propTypes.string,
    markMessageConversations: propTypes.func,
    selectedMessageConversation: propTypes.object,
    selectedMessageType: propTypes.object,
    updateMessageConversations: propTypes.func,
}

const mapStateToProps = state => ({
    selectedMessageType: state.messaging.selectedMessageType,
    selectedMessageConversation: state.messaging.selectedMessageConversation,
    checkedIds: state.messaging.checkedIds,
    feedbackRecipientsId: state.messaging.feedbackRecipientsId,
})

export default compose(
    connect(
        mapStateToProps,
        {
            clearCheckedIds,
            clearSelectedMessageConversation,
            deleteMessageConversations,
            updateMessageConversations,
            markMessageConversations,
        },
        null,
        { pure: false }
    )
)(ToolbarExtendedChoicePicker)
