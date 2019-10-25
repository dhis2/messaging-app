import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Assignment from 'material-ui-icons/Assignment';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import Delete from 'material-ui-icons/Delete';
import MarkUnread from 'material-ui-icons/Markunread';
import Done from 'material-ui-icons/Done';

import i18n from '@dhis2/d2-i18n';

import * as actions from 'constants/actions';
import extendedChoices from 'constants/extendedChoices';

import history from 'utils/history';
import AssignToDialog from './AssignToDialog';

const multiSelectDisplayLimit = 99;

class ToolbarExtendedChoicePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkedItems: false,
            dialogOpen: false,
            assignToOpen: false,
        };
    }

    getIds = () =>
        this.props.selectedMessageConversation && this.props.checkedIds.length === 0
            ? [this.props.selectedMessageConversation.id]
            : this.props.checkedIds.map(id => id.id);

    updateMessageConversation = (identifier, value) => {
        const ids = this.getIds();
        this.props.updateMessageConversations(
            ids,
            identifier,
            value,
            this.props.selectedMessageType,
            this.props.selectedMessageConversation,
        );
        this.props.checkedIds.length > 0 && this.props.clearCheckedIds();
    };

    markMessageConversations = mode => {
        const ids = this.getIds();
        this.props.markMessageConversations(mode, ids, this.props.selectedMessageType);
        this.props.checkedIds.length > 0 && this.props.clearCheckedIds();
    };

    toogleDialog = () => {
        this.setState({ dialogOpen: !this.state.dialogOpen });
    };

    render() {
        const messageConversation = this.props.selectedMessageConversation;
        const multiSelect = this.props.checkedIds.length > 0;
        const display = multiSelect || messageConversation !== undefined;

        const actionButtons = [
            <FlatButton label={i18n.t('Cancel')} primary onClick={() => this.toogleDialog()} />,
            <FlatButton
                label={i18n.t('Submit')}
                primary
                keyboardFocused
                onClick={() => {
                    this.props.deleteMessageConversations(
                        this.getIds(),
                        this.props.selectedMessageType,
                    );
                    this.toogleDialog();
                    this.props.clearCheckedIds();
                    history.push(`/${this.props.selectedMessageType.id}`);
                }}
            />,
        ];

        const displayNumberOfCheckedIds =
            this.props.checkedIds.length > multiSelectDisplayLimit
                ? `${multiSelectDisplayLimit}+`
                : this.props.checkedIds.length;

        return display ? (
            <div
                style={{
                    gridArea: '1 / 2 / span 1 / span 2',
                    width: '400px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                }}
            >
                <Dialog
                    title={i18n.t(
                        `Are you sure you want to delete selected message conversation${
                            this.props.checkedIds.length > 1 ? 's?' : '?'
                        }`,
                    )}
                    actions={actionButtons}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.toogleDialog}
                />
                <AssignToDialog
                    open={this.state.assignToOpen}
                    onRequestClose={() => this.setState({ assignToOpen: !this.state.assignToOpen })}
                    updateMessageConversations={id =>
                        this.updateMessageConversation('ASSIGNEE', id)
                    }
                    messageType={this.props.selectedMessageType}
                    feedbackRecipientsId={this.props.feedbackRecipientsId}
                />

                <div
                    style={{
                        gridArea: '1 / 1 / span 1 / span 1',
                        display: 'flex',
                        justifyContent: 'flex-start',
                    }}
                >
                    <IconButton
                        tooltip={i18n.t('Delete selected')}
                        onClick={() => {
                            this.toogleDialog();
                        }}
                    >
                        <Delete />
                    </IconButton>

                    <IconButton
                        tooltip={i18n.t('Mark selected as unread')}
                        onClick={() => {
                            this.markMessageConversations('unread');
                        }}
                    >
                        <MarkUnread />
                    </IconButton>

                    <IconButton
                        tooltip={i18n.t('Mark selected as read')}
                        onClick={() => {
                            this.markMessageConversations('read');
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
                            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                        >
                            <MenuItem
                                key={'markFollowUp'}
                                value={'markFollowUp'}
                                primaryText={i18n.t('Mark for followup')}
                                onClick={() => this.updateMessageConversation('FOLLOW_UP', true)}
                            />
                            <MenuItem
                                key={'clearFollowUp'}
                                value={'clearFollowUp'}
                                primaryText={i18n.t('Clear followup')}
                                onClick={() => this.updateMessageConversation('FOLLOW_UP', false)}
                            />
                            {this.props.displayExtendedChoices && <Divider />}
                            {this.props.displayExtendedChoices && (
                                <MenuItem
                                    key={'clearAssigned'}
                                    value={'clearAssigned'}
                                    primaryText={i18n.t('Clear assignee')}
                                    onClick={() =>
                                        this.updateMessageConversation('ASSIGNEE', undefined)
                                    }
                                />
                            )}
                            {this.props.displayExtendedChoices && (
                                <MenuItem
                                    primaryText={i18n.t('Set status')}
                                    key={'setStatus'}
                                    rightIcon={<ArrowDropRight />}
                                    menuItems={extendedChoices.STATUS.map(elem => (
                                        <MenuItem
                                            key={`${elem.key}_status`}
                                            value={elem.value}
                                            primaryText={elem.primaryText}
                                            onClick={() =>
                                                this.updateMessageConversation('STATUS', elem.key)
                                            }
                                        />
                                    ))}
                                />
                            )}
                            {this.props.displayExtendedChoices && (
                                <MenuItem
                                    primaryText={i18n.t('Set priority')}
                                    key={'setPriority'}
                                    rightIcon={<ArrowDropRight />}
                                    menuItems={extendedChoices.PRIORITY.map(elem => (
                                        <MenuItem
                                            key={`${elem.key}_priority`}
                                            value={elem.value}
                                            primaryText={elem.primaryText}
                                            onClick={() =>
                                                this.updateMessageConversation('PRIORITY', elem.key)
                                            }
                                        />
                                    ))}
                                />
                            )}
                        </IconMenu>
                    }
                </div>
                {multiSelect && (
                    <Subheader
                        style={{
                            gridArea: '1 / 2 / span 1 / span 1',
                            padding: '0px 0px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {`${displayNumberOfCheckedIds} ${i18n.t('selected')}`}
                    </Subheader>
                )}
            </div>
        ) : (
            <div />
        );
    }
}

export default compose(
    connect(
        state => ({
            selectedMessageType: state.messaging.selectedMessageType,
            selectedMessageConversation: state.messaging.selectedMessageConversation,
            checkedIds: state.messaging.checkedIds,
            feedbackRecipientsId: state.messaging.feedbackRecipientsId,
        }),
        dispatch => ({
            clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
            clearSelectedMessageConversation: () =>
                dispatch({
                    type: actions.CLEAR_SELECTED_MESSAGE_CONVERSATION,
                }),
            deleteMessageConversations: (messageConversationIds, messageType) =>
                dispatch({
                    type: actions.DELETE_MESSAGE_CONVERSATIONS,
                    payload: { messageConversationIds, messageType },
                }),
            updateMessageConversations: (
                messageConversationIds,
                identifier,
                value,
                messageType,
                selectedMessageConversation,
            ) =>
                dispatch({
                    type: actions.UPDATE_MESSAGE_CONVERSATIONS,
                    payload: {
                        messageConversationIds,
                        identifier,
                        value,
                        messageType,
                        selectedMessageConversation,
                    },
                }),
            markMessageConversations: (mode, markedConversations, messageType) =>
                dispatch({
                    type: actions.MARK_MESSAGE_CONVERSATIONS,
                    payload: {
                        mode,
                        markedConversations,
                        messageType,
                    },
                }),
            displaySnackMessage: (message, onSnackActionClick, onSnackRequestClose, snackType) =>
                dispatch({
                    type: actions.DISPLAY_SNACK_MESSAGE,
                    payload: { message, onSnackActionClick, onSnackRequestClose, snackType },
                }),
        }),
        null,
        { pure: false },
    ),
)(ToolbarExtendedChoicePicker);
