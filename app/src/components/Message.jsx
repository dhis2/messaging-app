import React from 'react';

import Divider from 'material-ui/Divider';
import CardText from 'material-ui/Card/CardText';

import i18n from 'd2-i18n';
import Linkify from 'react-linkify';

import theme from '../styles/theme';

import { fontFamily } from '../constants/development';

const moment = require('moment');

const Message = ({ displayTimeDiff, message, currentUser, lastMessage }) => {
    const fromTitle = message.sender
        ? currentUser && currentUser.id === message.sender.id
            ? 'me'
            : message.sender.displayName
        : 'system';
    const today = moment();
    const messageDate = moment(message.created).add(displayTimeDiff);

    return (
        <div
            style={{
                backgroundColor: theme.palette.canvasColor,
                padding: '16px 16px 16px 16px',
                gridArea: '1 / 1 / span 1 / span 2',
            }}
        >
            <div
                style={{
                    margin: '',
                    paddingBottom: '0px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                }}
            >
                <div
                    style={{
                        gridArea: '1 / 1 / span 1 / span 8',
                        fontFamily,
                    }}
                >
                    {(message.internal
                        ? i18n.t('Internal message from ')
                        : i18n.t('Message from ')
                    ).concat(fromTitle)}
                </div>

                <div
                    content={messageDate.format('YYYY-MM-DD hh:mm')}
                    placement={'bottom'}
                    style={{
                        gridArea: '1 / 10',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginRight: '10px',
                    }}
                >
                    <div
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily,
                        }}
                    >
                        {today.diff(messageDate, 'hours') < 72
                            ? `${messageDate.from(today)}, ${messageDate.format('HH:mm')}`
                            : today.year() === messageDate.year()
                                ? messageDate.format('MMM DD, HH:mm')
                                : messageDate.format('MMM DD, YYYY HH:mm')}
                    </div>
                </div>

                <CardText
                    style={{
                        gridArea: '2 / 1 / span 1 / span 10',
                        padding: '16px 0px 16px 0px',
                        fontFamily,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <Linkify>{message.text}</Linkify>
                </CardText>
            </div>
            {!lastMessage && <Divider />}
        </div>
    );
};

export default Message;
