import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Subheader from 'material-ui/Subheader/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import Flag from 'material-ui-icons/Flag';

import i18n from 'd2-i18n';

import history from 'utils/history';
import * as actions from 'constants/actions';
import ExtendedChoiceLabel from './ExtendedChoiceLabel';
import theme from '../styles/theme';
import { fontFamily } from '../constants/development';

const find = require('lodash/find');
const moment = require('moment');

class MessageConversationListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            backgroundColor: theme.palette.canvasColor,
            cursor: 'auto',
        };
    }

    onClick = messageConversation => {
        this.props.setSelectedMessageConversation(messageConversation);
        if (messageConversation && !messageConversation.read) {
            this.props.markMessageConversations(
                'read',
                [messageConversation.id],
                this.props.selectedMessageType,
                this.props.messageFilter,
                this.props.statusFilter,
                this.props.priorityFilter,
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

    getBackgroundColor = (messageConversation, checked) => {
        const selectedMessageConversation =
            this.props.selectedMessageConversation &&
            messageConversation.id === this.props.selectedMessageConversation.id;

        if (checked && !selectedMessageConversation) {
            return theme.palette.blue50;
        } else if (selectedMessageConversation) {
            return theme.palette.accent3Color;
        }
        return this.state.backgroundColor;
    };

    render() {
        const messageConversation = this.props.messageConversation;
        const title = messageConversation.lastSender
            ? messageConversation.lastSender.displayName
            : this.props.selectedMessageType.displayName;
        const checked = find(this.props.checkedIds, { id: messageConversation.id }) !== undefined;

        const displayExtendedChoices = this.props.displayExtendedChoices;

        const displayTimeDiff = this.props.displayTimeDiff;

        const today = moment();
        const messageDate = moment(messageConversation.lastMessage).add(displayTimeDiff);
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
                        event.target.innerText !== undefined && event.target.innerText !== '';

                    if (onClick && !this.props.settingSelectedMessageConversation) {
                        this.onClick(messageConversation);
                        this.props.checkedIds.length > 0 && this.props.clearCheckedIds();
                        if (
                            this.props.wideview &&
                            (this.props.messageFilter !== undefined ||
                                this.props.priorityFilter !== undefined ||
                                this.props.statusFilter !== undefined)
                        ) {
                            this.props.setFilter(undefined, 'MESSAGE');
                        }
                    }
                }}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
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
                {messageConversation.followUp && (
                    <Flag
                        style={{
                            gridArea: '1 / 1',
                            color: theme.palette.followUp,
                            alignSelf: 'center',
                            marginLeft: '40px',
                        }}
                    />
                )}
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
                        marginLeft: messageConversation.followUp ? '70px' : '50px',
                        fontWeight,
                    }}
                >
                    {title}
                </div>
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
                        title={i18n.t('Status')}
                        color={fontColor}
                        fontWeight={fontWeight}
                        label={messageConversation.status}
                    />
                )}
                {displayExtendedChoices && (
                    <ExtendedChoiceLabel
                        showTitle={false}
                        gridArea={'1/8'}
                        title={i18n.t('Priority')}
                        color={fontColor}
                        fontWeight={fontWeight}
                        label={messageConversation.priority}
                    />
                )}
                {this.props.notification &&
                    this.props.wideview && (
                        <ExtendedChoiceLabel
                            showTitle={false}
                            gridArea={'1/9'}
                            title={i18n.t('Assignee')}
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
                        fontFamily,
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
                        ? messageDate.from(today)
                        : today.year() === messageDate.year()
                            ? messageDate.format('MMM DD')
                            : messageDate.format('ll')}
                </Subheader>
            </Paper>
        );
    }
}

export default compose(
    connect(
        state => ({
            selectedMessageConversation: state.messaging.selectedMessageConversation,
            settingSelectedMessageConversation: state.messaging.settingSelectedMessageConversation,
            selectedMessageType: state.messaging.selectedMessageType,
            checkedIds: state.messaging.checkedIds,
            displayTimeDiff: state.messaging.displayTimeDiff,
            messageFilter: state.messaging.messageFilter,
            statusFilter: state.messaging.statusFilter,
            priorityFilter: state.messaging.priorityFilter,
        }),
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
            markMessageConversations: (
                mode,
                markedConversations,
                messageType,
                messageFilter,
                statusFilter,
                priorityFilter,
            ) =>
                dispatch({
                    type: actions.MARK_MESSAGE_CONVERSATIONS,
                    payload: {
                        mode,
                        markedConversations,
                        messageType,
                        messageFilter,
                        statusFilter,
                        priorityFilter,
                    },
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
