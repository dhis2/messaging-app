import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import Message from './Message';
import CustomFontIcon from './CustomFontIcon';
import ExtendedChoiceLabel from './ExtendedChoiceLabel';

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
        this.props.updateInputFields('', '', []);
        history.push(`/${messageConversation.messageType}/${messageConversation.id}`);
    };

    onMouseEnter = () =>
        this.setState({ cursor: 'pointer', backgroundColor: theme.palette.accent2Color });
    onMouseLeave = () =>
        this.setState({
            cursor: 'auto',
            backgroundColor: theme.palette.canvasColor,
        });

    render() {
        const messageConversation = this.props.messageConversation;
        const title = messageConversation.lastSender
            ? messageConversation.lastSender.displayName
            : this.props.selectedMessageType.displayName;
        const checked = _.find(this.props.checkedIds, { id: messageConversation.id }) != undefined;

        const displayExtendedChoices = this.props.displayExtendedChoices;

        const today = moment().subtract(this.props.displayTimeDiff);
        const messageDate = moment(messageConversation.lastMessage);
        const fontWeight = !messageConversation.read ? 'bold' : '';
        const fontColor = this.props.messageConversation.read ? 'black' : theme.palette.darkGray;

        return (
            <Paper
                style={{
                    backgroundColor: this.getBackgroundColor(messageConversation, checked),
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, minmax(10px, 1fr)',
                    gridTemplateRows: this.props.wideview ? '' : '15% 85%',
                    transition: 'all 0.2s ease-in-out',
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
                    onClick && this.props.wideview && this.props.setFilter('', 'MESSAGE');
                }}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div
                    style={{
                        fontFamily,
                        fontSize: '14px',
                        gridArea: this.props.wideview
                            ? '1 / 1 / span 1 / span 2'
                            : '1 / 1 / span 1 / span 6',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        alignSelf: 'center',
                        color: 'black',
                        marginLeft: '50px',
                        fontWeight,
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
                        marginLeft: '12px',
                        width: '24px',
                    }}
                    onCheck={(event, isInputChecked) => {
                        this.props.setChecked(messageConversation, !checked);
                    }}
                />

                <Subheader
                    style={{
                        gridArea: this.props.wideview
                            ? displayExtendedChoices
                                ? '1 / 3 / span 1 / span 4'
                                : '1 / 3 / span 1 / span 6'
                            : '2 / 1 / span 1 / span 10',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        paddingLeft: '10px',
                        marginTop: !this.props.wideview ? '-10px' : '',
                        fontFamily,
                        color: fontColor,
                        fontWeight,
                    }}
                >
                    {messageConversation.subject}
                </Subheader>

                {displayExtendedChoices && (
                    <ExtendedChoiceLabel
                        showTitle={false}
                        gridArea={'1/7'}
                        title={'Status'}
                        color={fontColor}
                        fontWeight={fontWeight}
                        label={messageConversation.status}
                    />
                )}
                {displayExtendedChoices && (
                    <ExtendedChoiceLabel
                        showTitle={false}
                        gridArea={'1/8'}
                        title={'Priority'}
                        color={fontColor}
                        fontWeight={fontWeight}
                        label={messageConversation.priority}
                    />
                )}
                {displayExtendedChoices && (
                    <ExtendedChoiceLabel
                        showTitle={false}
                        gridArea={'1/9'}
                        title={'Assignee'}
                        color={fontColor}
                        fontWeight={fontWeight}
                        label={
                            messageConversation.assignee
                                ? messageConversation.assignee.displayName
                                : undefined
                        }
                    />
                )}

                <Subheader
                    style={{
                        gridArea: this.props.wideview ? '1 / 10' : '1 / 7 / span 1 / span 4',
                        fontFamily: fontFamily,
                        color: fontColor,
                        paddingRight: '10px',
                        paddingLeft: this.props.wideview ? '16px' : '0px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: this.props.wideview ? '' : 'end',
                        fontWeight,
                    }}
                >
                    {today.diff(messageDate, 'hours') < 72
                        ? messageDate.from(today.utc())
                        : today.year() == messageDate.year()
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
                displayTimeDiff: state.messaging.displayTimeDiff,
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
            setFilter: (filter, filterType) =>
                dispatch({ type: actions.SET_FILTER, payload: { filter, filterType } }),
            updateInputFields: (subject, input, recipients) =>
                dispatch({
                    type: actions.UPDATE_INPUT_FIELDS,
                    payload: { subject, input, recipients },
                }),
        }),
        null,
        { pure: false },
    ),
)(MessageConversationListItem);
