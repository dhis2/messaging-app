import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import Subheader from 'material-ui/Subheader/Subheader';
import { List, ListItem } from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';
import MessageConversationListItem from './MessageConversationListItem';

import * as actions from 'constants/actions';
import { tabsStyles, messagePanelContainer, cardStyles, grid } from '../styles/style';
import theme from '../styles/theme';

const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT'];

class MessageConversationList extends Component {
    isBottom(el) {
        return el.scrollHeight - el.scrollTop < window.outerHeight;
    }

    onScroll(messageType) {
        const messageList = document.getElementById('messagelist');
        if (this.isBottom(messageList) && messageType.loaded < messageType.total) {
            messageType.page++;
            this.props.loadMoreMessageConversations(messageType);
        }
    }

    render() {
        const displayMessageList =
            !this.props.wideview || this.props.selectedMessageConversation == undefined;

        const gridArea = this.props.wideview
            ? '2 / 2 / span 1 / span 2'
            : '2 / 2 / span 1 / span 1';
        const children = _.uniqWith(
            this.props.messageConversations[this.props.selectedMessageType.id],
            _.isEqual,
        ).filter(
            child =>
                (child.status == this.props.statusFilter || this.props.statusFilter == null) &&
                (child.priority == this.props.priorityFilter || this.props.priorityFilter == null),
        );

        const messageType = this.props.selectedMessageType ? this.props.selectedMessageType : '';
        const selectedValue = this.props.selectedMessageConversation
            ? this.props.selectedMessageConversation.id
            : '';

        const notification = !!(NOTIFICATIONS.indexOf(messageType.id) + 1);
        return displayMessageList ? (
            <div
                id={'messagelist'}
                onScroll={() => this.onScroll(this.props.selectedMessageType)}
                style={{
                    gridArea: gridArea,
                    borderRightStyle: this.props.wideview ? '' : 'solid',
                    ...messagePanelContainer,
                }}
            >
                {children && children.length != 0 ? (
                    children.map(child => {
                        return (
                            <MessageConversationListItem
                                key={child.id}
                                messageConversation={child}
                                wideview={this.props.wideview}
                                selectedValue={selectedValue}
                                notification={notification}
                                displayExtendedChoices={this.props.displayExtendedChoices}
                            />
                        );
                    })
                ) : !messageType.loading ? (
                    <Subheader> No {messageType.displayName.toLowerCase()} messages</Subheader>
                ) : (
                    <div />
                )}
            </div>
        ) : (
            <div />
        );
    }
}

export default compose(
    connect(
        state => {
            return {
                messageTypes: state.messaging.messageTypes,
                messageConversations: state.messaging.messageConversations,
                selectedMessageConversation: state.messaging.selectedMessageConversation,
                selectedMessageType: state.messaging.selectedMessageType,
                messageFilter: state.messaging.messsageFilter,
            };
        },
        dispatch => ({
            loadMoreMessageConversations: messageType =>
                dispatch({
                    type: actions.LOAD_MORE_MESSAGE_CONVERSATIONS,
                    payload: { messageType },
                }),
        }),
    ),
    pure,
)(MessageConversationList);
