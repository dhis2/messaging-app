import i18n from '@dhis2/d2-i18n'
import CardText from 'material-ui/Card/CardText'
import Divider from 'material-ui/Divider'
import moment from 'moment'
import propTypes from 'prop-types'
import React from 'react'
import Linkify from 'react-linkify'
import { fontFamily } from '../../constants/development.js'
import theme from '../../styles/theme.js'
import Attachments from '../Attachments/Attachments.jsx'

const styles = {
    canvas(backgroundColor) {
        return {
            backgroundColor,
            padding: '16px 16px 16px 16px',
        }
    },
    innerCanvas: {
        margin: '',
        paddingBottom: '0px',
    },
    cardText: {
        padding: '16px 0px 16px 0px',
        fontFamily,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
    fromFormat: {
        fontFamily,
    },
    datePlacement: {
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
}

const Message = ({
    displayTimeDiff,
    message,
    currentUser,
    lastMessage,
    downloadAttachment,
    cancelAttachment,
    enableAttachments,
}) => {
    const fromTitle = message.sender
        ? currentUser && currentUser.id === message.sender.id
            ? 'me'
            : message.sender.displayName
        : 'system'
    const today = moment()
    const messageDate = moment(message.created).add(displayTimeDiff)

    return (
        <div style={styles.canvas(theme.palette.canvasColor)}>
            <div style={styles.innerCanvas}>
                <div style={styles.fromFormat}>
                    {message.internal
                        ? i18n.t(`Internal message from ${fromTitle}`)
                        : i18n.t(`Message from ${fromTitle}`)}
                </div>

                <div style={styles.datePlacement}>
                    <div style={styles.dateFormat}>
                        {today.diff(messageDate, 'hours') < 72
                            ? `${messageDate.from(today)}, ${messageDate.format(
                                  'HH:mm'
                              )}`
                            : today.year() === messageDate.year()
                            ? messageDate.format('MMM DD, HH:mm')
                            : messageDate.format('MMM DD, YYYY HH:mm')}
                    </div>
                </div>

                {enableAttachments && (
                    <Attachments
                        dataDirection={'download'}
                        style={{ paddingLeft: 0 }}
                        attachments={message.attachments}
                        downloadAttachment={downloadAttachment}
                        cancelAttachment={cancelAttachment}
                    />
                )}

                <CardText style={styles.cardText}>
                    <Linkify>{message.text}</Linkify>
                </CardText>
            </div>
            {!lastMessage && <Divider />}
        </div>
    )
}

Message.propTypes = {
    cancelAttachment: propTypes.func,
    currentUser: propTypes.object,
    displayTimeDiff: propTypes.number,
    downloadAttachment: propTypes.func,
    enableAttachments: propTypes.bool,
    lastMessage: propTypes.bool,
    message: propTypes.object,
}

export default Message
