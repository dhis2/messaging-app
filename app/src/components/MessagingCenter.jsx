import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Subject, Observable } from 'rxjs/Rx';
import { compose, lifecycle } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import CreateMessageIcon from 'material-ui-icons/Add';
import NavigationBack from 'material-ui-icons/ArrowBack';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import ViewFancy from 'material-ui-icons/ViewList';
import ViewList from 'material-ui-icons/ViewHeadline';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
import ToolbarExtendedChoicePicker from './ToolbarExtendedChoicePicker';

import extendedChoices from '../constants/extendedChoices';

import * as api from 'api/api';
import history from 'utils/history';

const headerHight = '48px';
const EXTENDED_CHOICES = ['TICKET', 'VALIDATION_RESULT'];
const searchDelay = 300;

class MessagingCenter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkedItems: false,
            wideview: true,
            statusFilter: null,
            priorityFilter: null,
        };
    }

    inputStream = new Subject();
    componentWillMount() {
        this.inputStream.debounce(() => Observable.timer(searchDelay)).subscribe(messageFilter => {
            if (this.props.selectedMessageType && this.props.messageFilter !== messageFilter) {
                this.props.loadMessageConversations(
                    this.props.selectedMessageType,
                    this.props.selectedMessageType.id,
                    messageFilter,
                    this.state.statusFilter,
                    this.state.priorityFilter,
                );
            }
        });

        const selectedMessageType = this.props.match.params.messageType;
        const selectedId = this.props.location.pathname.split('/').slice(-1)[0];

        if (selectedId !== selectedMessageType && selectedId !== 'create') {
            const initialMessageConversation = { id: selectedId };
            this.props.setSelectedMessageConversation(initialMessageConversation);
        }

        api
            .isInFeedbackRecipientGroup()
            .then(result => this.props.setIsInFeedbackRecipientGroup(result));

        this.props.messageTypes.map(messageType =>
            this.props.loadMessageConversations(
                messageType,
                selectedMessageType,
                this.props.messageFilter,
                this.state.statusFilter,
                this.state.priorityFilter,
            ),
        );
    }

    componentWillReceiveProps(nextProps) {
        if (
            !this.props.selectedMessageType ||
            this.props.selectedMessageType.id != nextProps.selectedMessageType.id
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

        if (selectedId != 'create' && this.props.doUpdateInputFields) {
            this.props.updateInputFields('', '', []);
        }

        if (
            prevProps.selectedMessageType &&
            this.props.selectedMessageType.id != prevProps.selectedMessageType.id
        ) {
            this.inputStream.next('');
            this.props.setMessageFilter('');
        }

        if (
            this.props.selectedMessageType != undefined &&
            !this.props.selectedMessageType.loading &&
            (prevState.statusFilter != this.state.statusFilter ||
                prevState.priorityFilter != this.state.priorityFilter ||
                prevProps.selectedMessageType === undefined ||
                prevProps.selectedMessageType.id != this.props.selectedMessageType.id)
        ) {
            this.props.loadMessageConversations(
                this.props.selectedMessageType,
                this.props.selectedMessageType.id,
                this.props.messageFilter,
                this.state.statusFilter,
                this.state.priorityFilter,
            );
        }

        if (
            selectedMessageType == selectedId &&
            this.props.selectedMessageConversation != undefined
        ) {
            this.props.clearSelectedMessageConversation();
        }
    }

    loadMoreMessageConversations = messageType => {
        let messageTypeState = _.find(this.props.messageTypes, { id: messageType });
        this.props.loadMessageConversations(
            messageTypeState.id,
            messageTypeState.page + 1,
            this.props.messageFilter,
            this.state.statusFilter,
            this.state.priorityFilter,
        );
    };

    toogleWideview = () => {
        this.setState({ wideview: !this.state.wideview });
    };

    render() {
        const messageType = this.props.match.params.messageType;
        const id = this.props.location.pathname.split('/').slice(-1)[0];
        const checkedOptions = this.props.checkedOptions;
        const displayExtendedChoices =
            (this.props.selectedMessageType
                ? !!(EXTENDED_CHOICES.indexOf(this.props.selectedMessageType.id) + 1)
                : false) && this.props.isInFeedbackRecipientGroup;

        return (
            <div style={grid}>
                <Paper
                    style={{
                        gridArea: '1 / 1 / span 1 / span 10',
                        display: 'grid',
                        gridTemplateColumns: grid.gridTemplateColumns,
                        backgroundColor: checkedOptions
                            ? theme.palette.blue50
                            : theme.palette.accent2Color,
                        zIndex: 10,
                    }}
                >
                    <div style={{ gridArea: '1 / 1', minWidth: '250px', alignSelf: 'center' }}>
                        {!checkedOptions && (
                            <FlatButton
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}
                                icon={<CreateMessageIcon />}
                                onClick={() => history.push('/PRIVATE/create')}
                                label={'Compose'}
                            />
                        )}

                        {checkedOptions && (
                            <FlatButton
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}
                                icon={<NavigationBack />}
                                onClick={() => this.props.clearCheckedIds()}
                                label={'Deselect all'}
                            />
                        )}
                    </div>

                    <ToolbarExtendedChoicePicker displayExtendedChoices={displayExtendedChoices} />

                    {displayExtendedChoices &&
                        !checkedOptions && (
                            <SelectField
                                style={{
                                    height: headerHight,
                                    gridArea: '1 / 7',
                                    marginRight: '10px',
                                    width: '95%',
                                }}
                                labelStyle={{
                                    color: this.state.statusFilter == null ? 'lightGray' : 'black',
                                    top: this.state.statusFilter == null ? '-15px' : '-2px',
                                }}
                                selectedMenuItemStyle={{ color: theme.palette.primary1Color }}
                                floatingLabelText={this.state.statusFilter == null ? 'Status' : ''}
                                floatingLabelStyle={{
                                    top: '15px',
                                }}
                                iconStyle={{
                                    top: this.state.statusFilter == null ? '-15px' : '0px',
                                }}
                                value={this.state.statusFilter}
                                onChange={(event, key, payload) => {
                                    this.setState({
                                        statusFilter: payload,
                                    });
                                }}
                            >
                                <MenuItem key={null} value={null} primaryText={''} />
                                {extendedChoices.STATUS.map(elem => (
                                    <MenuItem
                                        key={elem.key}
                                        value={elem.value}
                                        primaryText={elem.primaryText}
                                    />
                                ))}
                            </SelectField>
                        )}

                    {displayExtendedChoices &&
                        !checkedOptions && (
                            <SelectField
                                style={{
                                    height: headerHight,
                                    gridArea: '1 / 8',
                                    marginRight: '10px',
                                    width: '95%',
                                }}
                                labelStyle={{
                                    color:
                                        this.state.priorityFilter == null ? 'lightGray' : 'black',
                                    top: this.state.priorityFilter == null ? '-15px' : '-2px',
                                }}
                                selectedMenuItemStyle={{ color: theme.palette.primary1Color }}
                                floatingLabelText={
                                    this.state.priorityFilter == null ? 'Priority' : ''
                                }
                                floatingLabelStyle={{
                                    top: '15px',
                                }}
                                iconStyle={{
                                    top: this.state.priorityFilter == null ? '-15px' : '0px',
                                }}
                                value={this.state.priorityFilter}
                                onChange={(event, key, payload) => {
                                    this.setState({
                                        priorityFilter: payload,
                                    });
                                }}
                            >
                                <MenuItem key={null} value={null} primaryText={''} />
                                {extendedChoices.PRIORITY.map(elem => (
                                    <MenuItem
                                        key={elem.key}
                                        value={elem.value}
                                        primaryText={elem.primaryText}
                                    />
                                ))}
                            </SelectField>
                        )}

                    {!checkedOptions && (
                        <TextField
                            style={{
                                gridArea: '1 / 9 / span 1 / span 2',
                                height: headerHight,
                                width: '',
                                padding: '0px 0px',
                                marginRight: '100px',
                            }}
                            hintText={'Search'}
                            value={this.props.messageFilter}
                            onChange={(event, messageFilter) => {
                                this.inputStream.next(messageFilter);
                                this.props.setMessageFilter(messageFilter);
                            }}
                            type="search"
                            margin="normal"
                        />
                    )}

                    <div
                        style={{
                            gridArea: '1 / 10 / span 1 / span 1',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <FlatButton
                            style={{
                                display: 'flex',
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}
                            icon={!this.state.wideview ? <ViewList /> : <ViewFancy />}
                            onClick={() => this.toogleWideview()}
                        />
                    </div>
                </Paper>

                <SidebarList
                    {...this.props}
                    drawerOpen={this.state.drawerOpen}
                    gridColumn={1}
                    messageTypes={this.props.messageTypes}
                />

                {id == 'create' && <CreateMessage wideview={this.state.wideview} />}

                {id != 'create' ? (
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

                {this.props.selectedMessageConversation && id != 'create'
                    ? this.props.selectedMessageConversation != undefined && (
                          <MessageConversation
                              messageConversation={this.props.selectedMessageConversation}
                              wideview={this.state.wideview}
                              disableLink={true}
                              displayExtendedChoices={displayExtendedChoices}
                          />
                      )
                    : !this.state.wideview &&
                      id != 'create' && (
                          <div
                              style={{
                                  gridArea: '2 / 5 / span 1 / span 6',
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
                state.messaging.subject != '' ||
                state.messaging.input != '' ||
                state.messaging.recipients.length != 0;

            return {
                messageTypes: state.messaging.messageTypes,
                messageConversations: state.messaging.messageConversations,
                messageFilter: state.messaging.messageFilter,
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
            setMessageFilter: messageFilter =>
                dispatch({ type: actions.SET_MESSAGE_FILTER, payload: { messageFilter } }),
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
        }),
        null,
        { pure: false },
    ),
)(MessagingCenter);
