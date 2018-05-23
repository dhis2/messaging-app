import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import CustomDropDown from './CustomDropDown';
import MenuItem from 'material-ui/MenuItem';

import SuggestionField from './SuggestionField';
import CustomFontIcon from './CustomFontIcon';

import * as actions from 'constants/actions';
import extendedChoices from 'constants/extendedChoices';

class ExtendedChoicePicker extends Component {
    constructor(props) {
        super(props);
    }

    updateMessageConversation = (messageConversationIds, identifier, value) => {
        this.props.updateMessageConversations(
            messageConversationIds,
            identifier,
            value,
            this.props.selectedMessageType,
        );
        this.props.clearCheckedIds && this.props.clearCheckedIds();
    };

    markMessageConversations = mode => {
        const ids = [];
        this.props.checkedIds.forEach(id => ids.push(id.id));
        if (mode == 'unread') {
            this.props.markMessageConversationsUnread(ids, this.props.selectedMessageType);
        } else if (mode == 'read') {
            this.props.markMessageConversationsRead(ids, this.props.selectedMessageType);
        }
    };

    render() {
        const messageConversation = this.props.messageConversation;
        const multiSelect = !messageConversation;
        const assigneValue = multiSelect
            ? ''
            : messageConversation.assignee != undefined
                ? messageConversation.assignee.displayName
                : 'None';

        return (
            <div
                style={{
                    display: 'grid',
                    gridArea: '1 / 4',
                    gridTemplateColumns: '85% 15%',
                    alignSelf: 'bottom',
                }}
            >
                {this.props.displayExtendedChoices && (
                    <div
                        style={{
                            display: 'grid',
                            gridArea: '1 / 1',
                            gridTemplateColumns: '32% 32% 32%',
                            gridColumnGap: '1%',
                            height: '48px',
                            width: '100%',
                        }}
                    >
                        <CustomDropDown
                            style={{
                                height: '48px',
                            }}
                            gridColumn={1}
                            floatingLabelText={'Status'}
                            value={!multiSelect && messageConversation.status}
                            children={extendedChoices.STATUS.map(elem => (
                                <MenuItem
                                    key={elem.key}
                                    value={elem.value}
                                    primaryText={elem.primaryText}
                                    onClick={() =>
                                        this.updateMessageConversation(
                                            [messageConversation.id],
                                            'STATUS',
                                            elem.key,
                                        )
                                    }
                                />
                            ))}
                        />
                        <CustomDropDown
                            style={{
                                height: '48px',
                            }}
                            gridColumn={2}
                            floatingLabelText={'Priority'}
                            value={!multiSelect && messageConversation.priority}
                            children={[
                                extendedChoices.PRIORITY.map(elem => (
                                    <MenuItem
                                        key={elem.key}
                                        value={elem.value}
                                        primaryText={elem.primaryText}
                                        onClick={() =>
                                            this.updateMessageConversation(
                                                [messageConversation.id],
                                                'PRIORITY',
                                                elem.key,
                                            )
                                        }
                                    />
                                )),
                            ]}
                        />
                        <CustomDropDown
                            style={{
                                height: '48px',
                            }}
                            gridColumn={3}
                            floatingLabelText={'Assignee'}
                            value={assigneValue}
                            children={[
                                <MenuItem
                                    key={assigneValue}
                                    value={assigneValue}
                                    primaryText={assigneValue}
                                />,
                                <SuggestionField
                                    updateMessageConversation={chip =>
                                        this.updateMessageConversation(
                                            [messageConversation.id],
                                            'ASSIGNEE',
                                            chip.id,
                                        )
                                    }
                                    key={'suggestionField'}
                                    label={'Assignee'}
                                />,
                            ]}
                        />
                    </div>
                )}
                <div
                    style={{
                        gridArea: '1 / 2',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <CustomFontIcon
                        size={5}
                        child={this.props.messageConversation}
                        onClick={child =>
                            this.props.deleteMessageConversations(
                                [child.id],
                                this.props.selectedMessageType,
                            )
                        }
                        icon={'delete'}
                        tooltip={'Delete'}
                    />
                    <CustomFontIcon
                        size={5}
                        child={this.props.messageConversation}
                        onClick={child =>
                            this.props.markMessageConversationsUnread(
                                [child.id],
                                this.props.selectedMessageType,
                            )
                        }
                        icon={'markunread'}
                        tooltip={'Mark as unread'}
                    />
                </div>
            </div>
        );
    }
}

export default compose(
    connect(
        state => {
            return {
                selectedMessageType: state.messaging.selectedMessageType,
                checkedIds: state.messaging.checkedIds,
            };
        },
        dispatch => ({
            deleteMessageConversations: (messageConversationIds, messageType) =>
                dispatch({
                    type: actions.DELETE_MESSAGE_CONVERSATIONS,
                    payload: { messageConversationIds, messageType },
                }),
            updateMessageConversations: (messageConversationIds, identifier, value, messageType) =>
                dispatch({
                    type: actions.UPDATE_MESSAGE_CONVERSATIONS,
                    payload: { messageConversationIds, identifier, value, messageType },
                }),
            markMessageConversationsUnread: (markedUnreadConversations, messageType) =>
                dispatch({
                    type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD,
                    payload: { markedUnreadConversations, messageType },
                }),
            markMessageConversationsRead: (markedReadConversations, messageType) =>
                dispatch({
                    type: actions.MARK_MESSAGE_CONVERSATIONS_READ,
                    payload: { markedReadConversations, messageType },
                }),
        }),
    ),
)(ExtendedChoicePicker);
