import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import Message from './Message';
import ReplyCard from './ReplyCard';
import CustomFontIcon from './CustomFontIcon';
import ToolbarExtendedChoicePicker from './ToolbarExtendedChoicePicker';
import ExtendedInformation from './ExtendedInformation';

import { messageConversationContainer, subheader_minilist } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
import * as actions from 'constants/actions';
import { fontFamily } from '../constants/development';

const moment = require('moment');
const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT'];

class MessageConversationListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            backgroundColor: theme.palette.canvasColor,
            cursor: 'auto',
        };
    }

    getBackgroundColor = (messageConversation, checked) => {
        const selectedMessageConversation =
            this.props.selectedMessageConversation &&
            messageConversation.id == this.props.selectedMessageConversation.id;

        if (checked && !selectedMessageConversation) {
            return theme.palette.blue50;
        } else if (selectedMessageConversation) {
            return theme.palette.accent3Color;
        } else {
            return this.state.backgroundColor;
        }
    };

    onClick = messageConversation => {
        this.props.setSelectedMessageConversation(messageConversation);
        if (messageConversation && !messageConversation.read) {
            this.props.markMessageConversationsRead(
                [messageConversation.id],
                this.props.selectedMessageType,
            );
        }
        history.push(`/${messageConversation.messageType}/${messageConversation.id}`);
    };

    onMouseEnter = () => this.setState({ cursor: 'pointer' });
    onMouseLeave = () => this.setState({ cursor: 'auto' });

    render() {
        const messageConversation = this.props.messageConversation;
        const title = messageConversation.lastSender
            ? messageConversation.lastSender.displayName
            : this.props.selectedMessageType.displayName;
        const checked = _.find(this.props.checkedIds, { id: messageConversation.id }) != undefined;

        const displayExtendedChoices = this.props.displayExtendedChoices;

        const today = moment();
        const messageDate = moment(messageConversation.lastMessage);

        return (
            <Paper
                style={{
                    backgroundColor: this.getBackgroundColor(messageConversation, checked),
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gridTemplateRows: this.props.wideview ? '' : '15% 85%',
                    transition: 'all 0.2s ease-in-out',
                    borderLeftStyle:
                        !messageConversation.read && !this.state.expanded ? 'solid' : '',
                    borderLeftWidth: '6px',
                    borderLeftColor: '#439E8E',
                    cursor: this.state.cursor,
                    boxSizing: 'border-box',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                }}
                onClick={event => {
                    const onClick =
                        event.target.innerText != undefined && event.target.innerText != '';
                    onClick && this.onClick(messageConversation);
                    onClick && this.props.clearCheckedIds();
                    onClick && this.props.wideview && this.props.setMessageFilter('');
                }}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div
                    style={{
                        fontFamily: fontFamily,
                        fontSize: '14px',
                        gridArea: this.props.wideview
                            ? '1 / 1 / span 1 / span 2'
                            : displayExtendedChoices
                                ? '1 / 1 / span 1 / span 6'
                                : '1 / 1 / span 1 / span 9',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        alignSelf: 'center',
                        color: 'black',
                        marginLeft: '50px',
                    }}
                >
                    {title}
                </div>
                <Checkbox
                    checked={checked}
                    style={{
                        gridArea: '1 / 1',
                        display: 'flex',
                        alignSelf: 'center',
                        marginLeft: '10px',
                        width: '24px',
                    }}
                    onCheck={(event, isInputChecked) => {
                        this.props.setChecked(
                            messageConversation,
                            !messageConversation.selectedValue,
                        );
                    }}
                />

                <CardText
                    style={{
                        gridArea: this.props.wideview
                            ? '1 / 3 / span 1 / span 6'
                            : displayExtendedChoices
                                ? '2 / 1 / span 1 / span 6'
                                : '2 / 1 / span 1 / span 10',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        padding: '10px',
                        fontFamily: fontFamily,
                    }}
                >
                    {messageConversation.subject}
                </CardText>

                {displayExtendedChoices &&
                    this.props.isInFeedbackRecipientGroup && (
                        <ExtendedInformation
                            messageConversation={messageConversation}
                            gridArea={'1 / 7 / span 1 / span 3'}
                        />
                    )}
                <Subheader
                    style={{
                        gridArea: '1 / 10',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        paddingRight: '10px',
                        fontFamily: fontFamily,
                    }}
                >
                    {today.year() == messageDate.year()
                        ? messageDate.format('MMM DD')
                        : messageDate.format('ll')}
                </Subheader>
            </Paper>
        );
    }
}

export default compose(
    connect(
        state => {
            return {
                selectedMessageConversation: state.messaging.selectedMessageConversation,
                selectedMessageType: state.messaging.selectedMessageType,
                checkedIds: state.messaging.checkedIds,
                numberOfCheckedIds: state.messaging.checkedIds.length,
                isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
            };
        },
        dispatch => ({
            setChecked: (messageConversation, selectedValue) =>
                dispatch({
                    type: actions.SET_CHECKED,
                    payload: { messageConversation, selectedValue },
                }),
            setSelectedMessageConversation: messageConversation =>
                dispatch({
                    type: actions.SET_SELECTED_MESSAGE_CONVERSATION,
                    payload: { messageConversation },
                }),
            markMessageConversationsRead: (markedReadConversations, messageType) =>
                dispatch({
                    type: actions.MARK_MESSAGE_CONVERSATIONS_READ,
                    payload: { markedReadConversations, messageType },
                }),
            clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
            setMessageFilter: messageFilter =>
                dispatch({ type: actions.SET_MESSAGE_FILTER, payload: { messageFilter } }),
        }),
    ),
)(MessageConversationListItem);
