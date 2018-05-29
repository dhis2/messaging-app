import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import CreateMessageIcon from 'material-ui-icons/Add';
import NavigationBack from 'material-ui-icons/ArrowBack';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import ViewList from 'material-ui-icons/ViewList';
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

import history from 'utils/history';

const headerHight = '48px';
const EXTENDED_CHOICES = ['TICKET', 'VALIDATION_RESULT'];

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

    componentWillMount() {
        const selectedMessageType = this.props.match.params.messageType;
        const selectedId = this.props.location.pathname.split('/').slice(-1)[0];

        if (selectedId != selectedMessageType && selectedId != 'create') {
            const initialMessageConversation = { id: selectedId };
            this.props.setSelectedMessageConversation(initialMessageConversation);
        }

        this.props.messageTypes.map(messageType => {
            this.props.loadMessageConversations(
                messageType,
                selectedMessageType,
                this.props.messageFilter,
                this.state.statusFilter,
                this.state.priorityFilter,
            );
        });
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

        if (this.props.messageFilter != nextProps.messageFilter) {
            const selectedMessageConversationId = nextProps.selectedMessageConversation
                ? nextProps.selectedMessageConversation.id
                : undefined;
            this.props.loadMessageConversations(
                nextProps.selectedMessageType,
                nextProps.selectedMessageType.id,
                nextProps.messageFilter,
                this.state.statusFilter,
                this.state.priorityFilter,
            );
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const selectedMessageType = this.props.match.params.messageType;
        const selectedId = this.props.location.pathname.split('/').slice(-1)[0];

        if (
            prevState.statusFilter != this.state.statusFilter ||
            prevState.priorityFilter != this.state.priorityFilter
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
        const displayExtendedChoices = this.props.selectedMessageType
            ? !!(EXTENDED_CHOICES.indexOf(this.props.selectedMessageType.id) + 1)
            : false;

        return (
            <div style={grid}>
                <Paper
                    style={{
                        gridArea: '1 / 1 / span 1 / span 3',
                        display: 'grid',
                        gridTemplateColumns: 'minmax(150px, 15%) 20% 20% 45%',
                        backgroundColor: checkedOptions
                            ? theme.palette.blue50
                            : theme.palette.accent2Color,
                        zIndex: 10,
                    }}
                >
                    {messageType == 'PRIVATE' &&
                        !checkedOptions && (
                            <FlatButton
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignSelf: 'center',
                                    gridArea: '1 / 1',
                                    width: '150px',
                                }}
                                icon={<CreateMessageIcon />}
                                onClick={() => history.push('/' + messageType + '/create')}
                                label={'Compose'}
                            />
                        )}

                    {checkedOptions && (
                        <FlatButton
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignSelf: 'center',
                                gridArea: '1 / 1',
                                width: '150px',
                            }}
                            icon={<NavigationBack />}
                            onClick={() => this.props.clearCheckedIds()}
                            label={'Undo'}
                        />
                    )}

                    {!checkedOptions && (
                        <TextField
                            style={{
                                gridArea: '1 / 2',
                                height: headerHight,
                                padding: '0px 0px',
                            }}
                            fullWidth
                            hintText={'Search'}
                            value={this.props.messageFilter}
                            onChange={(event, messageFilter) =>
                                this.props.setMessageFilter(messageFilter)
                            }
                            type="search"
                            margin="normal"
                        />
                    )}

                    {displayExtendedChoices &&
                        !checkedOptions && (
                            <div
                                style={{
                                    gridArea: '1 / 3',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginLeft: '10px',
                                    height: headerHight,
                                }}
                            >
                                <SelectField
                                    style={{ width: '150px', height: headerHight }}
                                    labelStyle={{
                                        color:
                                            this.state.statusFilter == null ? 'lightGray' : 'black',
                                        top: this.state.statusFilter == null ? '-15px' : '-5px',
                                    }}
                                    selectedMenuItemStyle={{ color: theme.palette.primary1Color }}
                                    floatingLabelText={
                                        this.state.statusFilter == null ? 'Status' : ''
                                    }
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

                                <SelectField
                                    style={{ width: '150px', height: headerHight }}
                                    labelStyle={{
                                        color:
                                            this.state.priorityFilter == null
                                                ? 'lightGray'
                                                : 'black',
                                        top: this.state.priorityFilter == null ? '-15px' : '-5px',
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
                            </div>
                        )}

                    <div
                        style={{
                            gridArea: '1 / 4',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignSelf: 'center',
                        }}
                    >
                        <ToolbarExtendedChoicePicker
                            displayExtendedChoices={displayExtendedChoices}
                        />
                        <div
                            style={{
                                borderRight: '1px solid black',
                                alignSelf: 'center',
                                height: '26px',
                                padding: '5px',
                            }}
                        />
                        <FlatButton
                            style={{
                                display: 'flex',
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}
                            icon={<ViewList />}
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
                    : !this.state.wideview && (
                          <div
                              style={{
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
            return {
                messageTypes: state.messaging.messageTypes,
                messageConversations: state.messaging.messageConversations,
                messageFilter: state.messaging.messageFilter,
                selectedMessageType: state.messaging.selectedMessageType,
                selectedMessageConversation: state.messaging.selectedMessageConversation,
                checkedIds: state.messaging.checkedIds,
                checkedOptions: state.messaging.checkedIds.length > 0,
                loaded: state.messaging.loaded,
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
        }),
    ),
)(MessagingCenter);
