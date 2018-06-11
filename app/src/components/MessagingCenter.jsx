import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import Toggle from 'material-ui/Toggle';

import Subheader from 'material-ui/Subheader/Subheader';
import { ToolbarSeparator } from 'material-ui/Toolbar';
import MailIcon from 'material-ui-icons/MailOutline';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { grid, subheader } from '../styles/style';

import SidebarList from './SidebarList';
import MessageConversation from './MessageConversation';
import MessageConversationList from './MessageConversationList';
import CreateMessage from './CreateMessage';
import Toolbar from './Toolbar';

import * as api from 'api/api';

const EXTENDED_CHOICES = ['TICKET', 'VALIDATION_RESULT'];

class MessagingCenter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkedItems: false,
            wideview: true,
        };
    }

    componentWillMount() {
        const selectedMessageType = this.props.match.params.messageType;
        const selectedId = this.props.location.pathname.split('/').slice(-1)[0];

        if (selectedId !== selectedMessageType && selectedId !== 'create') {
            const initialMessageConversation = { id: selectedId };
            this.props.setSelectedMessageConversation(initialMessageConversation);
        }

        api.isInFeedbackRecipientGroup().then(result =>
            this.props.setIsInFeedbackRecipientGroup(result),
        );

        this.props.messageTypes.map(messageType =>
            this.props.loadMessageConversations(messageType, selectedMessageType, null, null, null),
        );
    }

    componentWillReceiveProps(nextProps) {
        if (
            !this.props.selectedMessageType ||
            this.props.selectedMessageType.id !== nextProps.selectedMessageType.id
        ) {
            this.setState({
                statusFilter: null,
                priorityFilter: null,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const selectedMessageType = this.props.match.params.messageType;
        const selectedId = this.props.location.pathname.split('/').slice(-1)[0];

        if (
            selectedId !== 'create' &&
            this.props.doUpdateInputFields &&
            this.props.snackMessage === ''
        ) {
            this.props.updateInputFields('', '', []);
        }

        if (
            (selectedMessageType === selectedId || selectedId === 'create') &&
            this.props.selectedMessageConversation !== undefined
        ) {
            this.props.clearSelectedMessageConversation();
        }
    }

    toogleWideview = () => {
        this.setState({ wideview: !this.state.wideview });
    };

    render() {
        const id = this.props.location.pathname.split('/').slice(-1)[0];

        const displayExtendedChoices =
            (this.props.selectedMessageType
                ? !!(EXTENDED_CHOICES.indexOf(this.props.selectedMessageType.id) + 1)
                : false) && this.props.isInFeedbackRecipientGroup;

        return (
            <div style={grid}>
                <Toolbar
                    {...this.props}
                    id={id}
                    wideview={this.state.wideview}
                    displayExtendedChoices={displayExtendedChoices}
                    toogleWideview={this.toogleWideview}
                />

                <SidebarList
                    {...this.props}
                    drawerOpen={this.state.drawerOpen}
                    gridColumn={1}
                    messageTypes={this.props.messageTypes}
                />

                {id === 'create' && <CreateMessage wideview={this.state.wideview} />}

                {id !== 'create' ? (
                    <MessageConversationList
                        wideview={this.state.wideview}
                        displayExtendedChoices={displayExtendedChoices && this.state.wideview}
                    />
                ) : (
                    !this.state.wideview && (
                        <MessageConversationList
                            wideview={this.state.wideview}
                            displayExtendedChoices={displayExtendedChoices && this.state.wideview}
                        />
                    )
                )}

                {this.props.selectedMessageConversation && id !== 'create'
                    ? this.props.selectedMessageConversation !== undefined && (
                          <MessageConversation
                              messageConversation={this.props.selectedMessageConversation}
                              wideview={this.state.wideview}
                              disableLink={true}
                              displayExtendedChoices={displayExtendedChoices}
                          />
                      )
                    : !this.state.wideview &&
                      id !== 'create' && (
                          <div
                              style={{
                                  gridArea: '2 / 4 / span 1 / span 7',
                                  textAlign: 'center',
                                  paddingTop: '100px',
                              }}
                          >
                              <Subheader style={subheader}>{'Select a message'}</Subheader>
                              <MailIcon
                                  style={{
                                      color: theme.palette.primary1Color,
                                      width: 120,
                                      height: 120,
                                  }}
                              />
                          </div>
                      )}
            </div>
        );
    }
}

export default compose(
    connect(
        state => {
            const doUpdateInputFields =
                (state.messaging.subject !== '' ||
                    state.messaging.input !== '' ||
                    state.messaging.recipients.length !== 0) &&
                !state.messaging.selectedMessageConversation;

            return {
                snackMessage: state.messaging.snackMessage,
                messageTypes: state.messaging.messageTypes,
                messageConversations: state.messaging.messageConversations,
                messageFilter: state.messaging.messageFilter,
                statusFilter: state.messaging.statusFilter,
                priorityFilter: state.messaging.priorityFilter,
                selectedMessageType: state.messaging.selectedMessageType,
                selectedMessageConversation: state.messaging.selectedMessageConversation,
                checkedIds: state.messaging.checkedIds,
                checkedOptions: state.messaging.checkedIds.length > 0,
                loaded: state.messaging.loaded,
                isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
                doUpdateInputFields: doUpdateInputFields,
            };
        },
        dispatch => ({
            loadMessageConversations: (
                messageType,
                selectedMessageType,
                messageFilter,
                statusFilter,
                priorityFilter,
            ) =>
                dispatch({
                    type: actions.LOAD_MESSAGE_CONVERSATIONS,
                    payload: {
                        messageType,
                        selectedMessageType,
                        messageFilter,
                        statusFilter,
                        priorityFilter,
                    },
                }),
            setIsInFeedbackRecipientGroup: isInFeedbackRecipientGroup =>
                dispatch({
                    type: actions.SET_IN_FEEDBACK_RECIPIENT_GROUP,
                    payload: { isInFeedbackRecipientGroup },
                }),
            clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
            setSelectedMessageConversation: messageConversation =>
                dispatch({
                    type: actions.SET_SELECTED_MESSAGE_CONVERSATION,
                    payload: { messageConversation },
                }),
            clearSelectedMessageConversation: () =>
                dispatch({
                    type: actions.CLEAR_SELECTED_MESSAGE_CONVERSATION,
                }),
            updateInputFields: (subject, input, recipients) =>
                dispatch({
                    type: actions.UPDATE_INPUT_FIELDS,
                    payload: { subject, input, recipients },
                }),
            setFilter: (filter, filterType) =>
                dispatch({ type: actions.SET_FILTER, payload: { filter, filterType } }),
        }),
        null,
        { pure: false },
    ),
)(MessagingCenter);
