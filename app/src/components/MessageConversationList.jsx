import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Subheader from 'material-ui/Subheader/Subheader';
import CircularProgress from 'material-ui/CircularProgress';

import i18n from 'd2-i18n';

import * as actions from 'constants/actions';
import { messagePanelContainer } from '../styles/style';
import theme from '../styles/theme';
import ListItemHeader from './ListItemHeader';
import MessageConversationListItem from './MessageConversationListItem';

const uniqWith = require('lodash/uniqWith');
const isEqual = require('lodash/isEqual');

const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT'];
const bottomEmptyHeight = 50;

class MessageConversationList extends Component {
    onScroll = messageType => {
        const messageList = document.getElementById('messagelist');
        if (
            !this.props.selectedMessageType.loading &&
            this.isBottom(messageList) &&
            messageType.loaded < messageType.total
        ) {
            messageType.page++;
            this.props.loadMoreMessageConversations(
                messageType,
                this.props.messageFilter,
                this.props.statusFilter,
                this.props.priorityFilter,
            );
        }
    };

    isBottom = el => el.scrollHeight - el.scrollTop < window.outerHeight;

    render() {
        const displayMessageList =
            !this.props.wideview || this.props.selectedMessageConversation === undefined;

        const gridArea = this.props.wideview
            ? '2 / 2 / span 1 / span 9'
            : '2 / 2 / span 1 / span 2';
        const children = uniqWith(
            this.props.messageConversations[this.props.selectedMessageType.id],
            isEqual,
        );

        const messageType = this.props.selectedMessageType ? this.props.selectedMessageType : '';
        const selectedValue = this.props.selectedMessageConversation
            ? this.props.selectedMessageConversation.id
            : '';

        const notification = !!(NOTIFICATIONS.indexOf(messageType.id) + 1);
        return (
            <div
                id={'messagelist'}
                onScroll={() => this.onScroll(this.props.selectedMessageType)}
                style={{
                    gridArea,
                    borderRightStyle: this.props.wideview ? '' : 'solid',
                    ...messagePanelContainer,
                }}
            >
                {this.props.wideview && (
                    <ListItemHeader displayExtendedChoices={this.props.displayExtendedChoices}>
                        {children}
                    </ListItemHeader>
                )}
                {children && children.length !== 0
                    ? children.map(child => (
                          <MessageConversationListItem
                              key={child.id}
                              messageConversation={child}
                              wideview={this.props.wideview}
                              selectedValue={selectedValue}
                              notification={notification}
                              displayExtendedChoices={this.props.displayExtendedChoices}
                          />
                      ))
                    : !this.props.selectedMessageType.loading && (
                          <Subheader>
                              {i18n.t(`No ${messageType.displayName.toLowerCase()} messages`)}
                          </Subheader>
                      )}
                {this.props.selectedMessageType.loading && (
                    <div
                        style={{
                            backgroundColor: theme.palette.accent2Color,
                            height: `${bottomEmptyHeight}px`,
                            transition: 'all 0.2s ease-in-out',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress
                            style={{ marginTop: '10px' }}
                            color={theme.palette.primary1Color}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default compose(
    connect(
        state => ({
            messageTypes: state.messaging.messageTypes,
            messageFilter: state.messaging.messageFilter,
            statusFilter: state.messaging.statusFilter,
            priorityFilter: state.messaging.priorityFilter,
            messageConversations: state.messaging.messageConversations,
            selectedMessageConversation: state.messaging.selectedMessageConversation,
            selectedMessageType: state.messaging.selectedMessageType,
        }),
        dispatch => ({
            loadMoreMessageConversations: (
                messageType,
                messageFilter,
                statusFilter,
                priorityFilter,
            ) =>
                dispatch({
                    type: actions.LOAD_MORE_MESSAGE_CONVERSATIONS,
                    payload: { messageType, messageFilter, statusFilter, priorityFilter },
                }),
        }),
        null,
        { pure: false },
    ),
)(MessageConversationList);
