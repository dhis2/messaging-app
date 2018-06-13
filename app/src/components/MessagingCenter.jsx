import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Subheader from 'material-ui/Subheader/Subheader';
import MailIcon from 'material-ui-icons/MailOutline';

import i18n from 'd2-i18n';

import * as api from 'api/api';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { grid, subheader } from '../styles/style';

import SidebarList from './SidebarList';
import MessageConversation from './MessageConversation';
import MessageConversationList from './MessageConversationList';
import CreateMessage from './CreateMessage';
import Toolbar from './Toolbar';

import { SET_DISPLAY_TIME_DIFF } from '../constants/actions';

const EXTENDED_CHOICES = ['TICKET', 'VALIDATION_RESULT'];
const autoRefreshTime = 300000;
const subtractInterval = 10000;

class MessagingCenter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkedItems: false,
            wideview: true,
            autoRefresh: false,
            timer: null,
            counter: autoRefreshTime,
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

        this.props.setDisplayTimeDiff();

        setTimeout(() => {
            this.autoRefresh();
        }, autoRefreshTime);
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

    setAutoRefresh = autoRefresh => {
        !autoRefresh && clearInterval(this.state.timer);
        this.setState({
            autoRefresh,
            counter: !autoRefresh ? autoRefreshTime : this.state.counter,
            timer: !autoRefresh ? null : setInterval(this.tick.bind(this), subtractInterval),
        });
    };

    tick() {
        this.setState({
            counter: this.state.counter - subtractInterval,
        });
    }

    autoRefresh() {
        this.state.autoRefresh &&
            this.props.loadMessageConversations(
                this.props.selectedMessageType,
                this.props.selectedMessageType,
                this.props.messageFilter,
                this.props.statusFilter,
                this.props.priorityFilter,
            );

        this.setState({ counter: autoRefreshTime });
        setTimeout(() => {
            this.autoRefresh();
        }, autoRefreshTime);
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
                    autoRefresh={this.state.autoRefresh}
                    counter={this.state.counter}
                    setAutoRefresh={this.setAutoRefresh}
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
                              disableLink
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
                              <Subheader style={subheader}>{i18n.t('Select a message')}</Subheader>
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
                doUpdateInputFields,
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
            setDisplayTimeDiff: () => dispatch({ type: SET_DISPLAY_TIME_DIFF }),
        }),
        null,
        { pure: false },
    ),
)(MessagingCenter);
