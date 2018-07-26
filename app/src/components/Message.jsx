import React from 'react';

import Divider from 'material-ui/Divider';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';

import Attachments from './Attachments';

import i18n from 'd2-i18n';
import Linkify from 'react-linkify';

import theme from '../styles/theme';

import { fontFamily } from '../constants/development';

const moment = require('moment');

const styles = {
    canvas(backgroundColor) {
        return {
            backgroundColor,
            padding: '16px 16px 16px 16px',
            gridArea: '1 / 1 / span 1 / span 2',
        };
    },
    innerCanvas: {
        margin: '',
        paddingBottom: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
    },
    cardText: {
        gridArea: '3 / 1 / span 1 / span 10',
        padding: '16px 0px 16px 0px',
        fontFamily,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
    fromFormat: {
        gridArea: '1 / 1 / span 1 / span 8',
        fontFamily,
    },
    datePlacement: {
        gridArea: '1 / 10',
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '10px',
    },
    dateFormat: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily,
    },
};

const Message = ({
    displayTimeDiff,
    message,
    currentUser,
    lastMessage,
    downloadAttachment,
    cancelAttachment,
}) => {
    const fromTitle = message.sender
        ? currentUser && currentUser.id === message.sender.id
            ? 'me'
            : message.sender.displayName
        : 'system';
    const today = moment();
    const messageDate = moment(message.created).add(displayTimeDiff);

    return (
        <div style={styles.canvas(theme.palette.canvasColor)}>
            <div style={styles.innerCanvas}>
                <div style={styles.fromFormat}>
                    {message.internal
                        ? i18n.t(`Internal message from ${fromTitle}`)
                        : i18n.t(`Message from ${fromTitle}`)}
                </div>

                <div placement={'bottom'} style={styles.datePlacement}>
                    <div style={styles.dateFormat}>
                        {today.diff(messageDate, 'hours') < 72
                            ? `${messageDate.from(today)}, ${messageDate.format('HH:mm')}`
                            : today.year() === messageDate.year()
                                ? messageDate.format('MMM DD, HH:mm')
                                : messageDate.format('MMM DD, YYYY HH:mm')}
                    </div>
                </div>

                <Attachments
                    dataDirection={'download'}
                    style={{ paddingLeft: '0px', gridArea: '2 / 1 / span 1 / span 10' }}
                    attachments={message.attachments}
                    downloadAttachment={downloadAttachment}
                    cancelAttachment={cancelAttachment}
                />

                <CardText style={styles.cardText}>
                    <Linkify>{message.text}</Linkify>
                </CardText>
            </div>
            {!lastMessage && <Divider />}
        </div>
    );
};

export default Message;
