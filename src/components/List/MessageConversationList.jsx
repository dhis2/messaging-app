import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Subheader from 'material-ui/Subheader/Subheader'
import CircularProgress from 'material-ui/CircularProgress'
import i18n from '@dhis2/d2-i18n'
import { loadMessageConversations } from '../../actions'
import { messagePanelContainer } from '../../styles/style'
import theme from '../../styles/theme'
import ListItemHeader from './ListItemHeader'
import MessageConversationListItem from './MessageConversationListItem'
import { dedupeById, debounce } from '../../utils/helpers'

const NOTIFICATIONS = ['VALIDATION_RESULT', 'TICKET']
const bottomEmptyHeight = 50

const styles = {
    canvas(wideview) {
        return {
            flex: '1 0',
            maxWidth: wideview ? 'none' : '350px',
            minWidth: wideview ? 'none' : '250px',
            borderRightStyle: wideview ? '' : 'solid',
            ...messagePanelContainer,
        }
    },
    loading: {
        backgroundColor: theme.palette.accent2Color,
        height: `${bottomEmptyHeight}px`,
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        justifyContent: 'center',
    },
}

class MessageConversationList extends Component {
    onScroll = messageType => {
        const messageList = document.getElementById('messagelist')
        if (
            !this.props.selectedMessageType.loading &&
            this.isBottom(messageList) &&
            messageType.loaded < messageType.total
        ) {
            this.props.loadMessageConversations(
                messageType,
                messageType.id,
                true
            )
        }
    }

    debouncedOnScroll = debounce(this.onScroll, 150)
    isBottom = el => el.scrollHeight - el.scrollTop < window.outerHeight

    render() {
        const children = dedupeById(
            this.props.messageConversations[this.props.selectedMessageType.id]
        )

        const messageType = this.props.selectedMessageType
            ? this.props.selectedMessageType
            : ''
        const selectedValue = this.props.selectedMessageConversation
            ? this.props.selectedMessageConversation.id
            : ''

        const notification = !!(NOTIFICATIONS.indexOf(messageType.id) + 1)
        return (
            <div
                id={'messagelist'}
                onScroll={() =>
                    this.debouncedOnScroll(this.props.selectedMessageType)
                }
                style={styles.canvas(this.props.wideview)}
            >
                {this.props.wideview && (
                    <ListItemHeader
                        notification={notification}
                        displayExtendedChoices={
                            this.props.displayExtendedChoices
                        }
                    >
                        {children}
                    </ListItemHeader>
                )}
                {children && children.length !== 0
                    ? children.map(child => (
                          <MessageConversationListItem
                              key={child.id}
                              messageConversation={child}
                              wideview={this.props.wideview}
                              selectedValue={selectedValue}
                              notification={notification}
                              displayExtendedChoices={
                                  this.props.displayExtendedChoices
                              }
                          />
                      ))
                    : !this.props.selectedMessageType.loading && (
                          <Subheader>
                              {i18n.t(
                                  `No ${messageType.displayName.toLowerCase()} messages`
                              )}
                          </Subheader>
                      )}
                {this.props.selectedMessageType.loading && (
                    <div style={styles.loading}>
                        <CircularProgress
                            style={{ marginTop: '10px' }}
                            color={theme.palette.primary1Color}
                        />
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    messageTypes: state.messaging.messageTypes,
    messageFilter: state.messaging.messageFilter,
    statusFilter: state.messaging.statusFilter,
    priorityFilter: state.messaging.priorityFilter,
    messageConversations: state.messaging.messageConversations,
    selectedMessageConversation: state.messaging.selectedMessageConversation,
    selectedMessageType: state.messaging.selectedMessageType,
})

export default compose(
    connect(
        mapStateToProps,
        {
            loadMessageConversations,
        },
        null,
        { pure: false }
    )
)(MessageConversationList)
