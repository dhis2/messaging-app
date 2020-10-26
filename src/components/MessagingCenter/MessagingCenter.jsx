import React, { Component } from 'react'
import propTypes from '@dhis2/prop-types'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Subheader from 'material-ui/Subheader/Subheader'
import MailIcon from 'material-ui-icons/MailOutline'
import i18n from '@dhis2/d2-i18n'
import * as api from '../../api/api'
import {
    loadMessageConversations,
    setIsInFeedbackRecipientGroup,
    clearCheckedIds,
    setSelectedMessageConversation,
    setSelectedMessageType,
    clearSelectedMessageConversation,
    updateInputFields,
    setFilter,
    setDisplayTimeDiff,
    clearAttachments,
} from '../../actions'
import theme from '../../styles/theme'
import MessageConversation from '../MessageConversation/MessageConversation'
import SidebarList from '../List/SidebarList'
import MessageConversationList from '../List/MessageConversationList'
import CreateMessage from '../MessageConversation/CreateMessage'
import Toolbar from '../Common/Toolbar'
import { subheader } from '../../styles/style'
import './MessagingCenter.css'

const EXTENDED_CHOICES = ['TICKET', 'VALIDATION_RESULT']
const refreshTimerTotal = 300000 // 5 minutes
const refreshTimerInterval = 10000 // 10 seconds

class MessagingCenter extends Component {
    constructor(props) {
        super(props)

        this.intervalId = null
        this.state = {
            autoRefresh: false,
            checkedItems: false,
            refreshTimer: refreshTimerTotal,
            wideview: true,
        }
    }

    componentDidMount() {
        const selectedMessageType = this.props.match.params.messageType
        const selectedId = this.props.match.params.messageId

        if (
            selectedId &&
            selectedId !== selectedMessageType &&
            selectedId !== 'create'
        ) {
            const initialMessageConversation = { id: selectedId }
            this.props.setSelectedMessageConversation(
                initialMessageConversation
            )
        }

        api.isInFeedbackRecipientGroup(this.props.currentUser).then(result =>
            this.props.setIsInFeedbackRecipientGroup(result)
        )

        this.props.messageTypes.map(messageType =>
            this.props.loadMessageConversations(
                messageType,
                selectedMessageType
            )
        )

        this.props.setDisplayTimeDiff()
    }

    componentDidUpdate() {
        const selectedMessageType = this.props.match.params.messageType
        const selectedId = this.props.match.params.messageId

        if (
            !this.props.settingSelectedMessageConversation &&
            selectedId &&
            selectedMessageType !== selectedId &&
            selectedId !== 'create' &&
            (this.props.selectedMessageConversation === undefined ||
                selectedId !== this.props.selectedMessageConversation.id)
        ) {
            const initialMessageConversation = { id: selectedId }
            this.props.setSelectedMessageConversation(
                initialMessageConversation
            )
        }

        if (
            selectedMessageType === selectedId &&
            selectedMessageType !== this.props.selectedMessageType.id
        ) {
            this.props.setSelectedMessageType(selectedMessageType)
        }

        if (
            (selectedMessageType === selectedId || selectedId === 'create') &&
            this.props.selectedMessageConversation !== undefined
        ) {
            this.props.clearSelectedMessageConversation()
        }
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }

    setAutoRefresh = autoRefresh => {
        // Cancel existing interval if it shouldn't autorefresh
        if (!autoRefresh && this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }

        if (autoRefresh) {
            this.intervalId = setInterval(this.tick, refreshTimerInterval)
        }

        this.setState({
            autoRefresh,
            refreshTimer: refreshTimerTotal,
        })
    }

    tick = () => {
        const timerHasElapsed =
            this.state.refreshTimer - refreshTimerInterval <= 0

        if (timerHasElapsed) {
            this.refresh()
            this.setState({
                refreshTimer: refreshTimerTotal,
            })
        } else {
            this.setState(prevState => ({
                refreshTimer: prevState.refreshTimer - refreshTimerInterval,
            }))
        }
    }

    refresh = () => {
        this.props.messageTypes.map(messageType =>
            this.props.loadMessageConversations(
                messageType,
                this.props.selectedMessageType
            )
        )

        if (this.props.selectedMessageConversation) {
            this.props.setSelectedMessageConversation(
                this.props.selectedMessageConversation
            )
        }
    }

    toogleWideview = () => {
        this.setState({ wideview: !this.state.wideview })
    }

    render() {
        const id = this.props.match.params.messageId

        const displayExtendedChoices =
            (this.props.selectedMessageType
                ? !!(
                      EXTENDED_CHOICES.indexOf(
                          this.props.selectedMessageType.id
                      ) + 1
                  )
                : false) && this.props.isInFeedbackRecipientGroup

        return (
            <div className="messaging-center">
                <Toolbar
                    {...this.props}
                    id={id}
                    wideview={this.state.wideview}
                    displayExtendedChoices={displayExtendedChoices}
                    toogleWideview={this.toogleWideview}
                />
                <div className="messaging-center__main-content">
                    <SidebarList
                        {...this.props}
                        drawerOpen={this.state.drawerOpen}
                        messageTypes={this.props.messageTypes}
                        autoRefresh={this.state.autoRefresh}
                        refreshTimer={this.state.refreshTimer}
                        setAutoRefresh={this.setAutoRefresh}
                    />

                    {this.props.selectedMessageConversation === undefined &&
                        !(this.state.wideview && id === 'create') && (
                            <MessageConversationList
                                wideview={this.state.wideview}
                                displayExtendedChoices={
                                    displayExtendedChoices &&
                                    this.state.wideview
                                }
                            />
                        )}

                    {id === 'create' && (
                        <CreateMessage
                            {...this.props}
                            wideview={this.state.wideview}
                        />
                    )}

                    {this.props.selectedMessageConversation !== undefined &&
                        !this.state.wideview && (
                            <MessageConversationList
                                wideview={this.state.wideview}
                                displayExtendedChoices={
                                    displayExtendedChoices &&
                                    this.state.wideview
                                }
                            />
                        )}

                    {this.props.selectedMessageConversation && id !== 'create'
                        ? this.props.selectedMessageConversation !==
                              undefined && (
                              <MessageConversation
                                  {...this.props}
                                  messageConversation={
                                      this.props.selectedMessageConversation
                                  }
                                  wideview={this.state.wideview}
                                  disableLink
                                  displayExtendedChoices={
                                      displayExtendedChoices
                                  }
                              />
                          )
                        : !this.state.wideview &&
                          id !== 'create' && (
                              <div className="messaging-center__no-message-selected">
                                  <Subheader style={subheader}>
                                      {i18n.t('Select a message')}
                                  </Subheader>
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
            </div>
        )
    }
}

MessagingCenter.propTypes = {
    clearSelectedMessageConversation: propTypes.func,
    currentUser: propTypes.object,
    isInFeedbackRecipientGroup: propTypes.bool,
    loadMessageConversations: propTypes.func,
    match: propTypes.object,
    messageTypes: propTypes.array,
    selectedMessageConversation: propTypes.object,
    selectedMessageType: propTypes.object,
    setDisplayTimeDiff: propTypes.func,
    setIsInFeedbackRecipientGroup: propTypes.func,
    setSelectedMessageConversation: propTypes.func,
    setSelectedMessageType: propTypes.func,
    settingSelectedMessageConversation: propTypes.bool,
}

const mapStateToProps = state => ({
    currentUser: state.messaging.currentUser,
    snackMessage: state.messaging.snackMessage,
    messageTypes: state.messaging.messageTypes,
    messageConversations: state.messaging.messageConversations,
    messageFilter: state.messaging.messageFilter,
    statusFilter: state.messaging.statusFilter,
    priorityFilter: state.messaging.priorityFilter,
    assignedToMeFilter: state.messaging.assignedToMeFilter,
    markedForFollowUpFilter: state.messaging.markedForFollowUpFilter,
    unreadFilter: state.messaging.unreadFilter,
    selectedMessageType: state.messaging.selectedMessageType,
    selectedMessageConversation: state.messaging.selectedMessageConversation,
    settingSelectedMessageConversation:
        state.messaging.settingSelectedMessageConversation,
    checkedIds: state.messaging.checkedIds,
    checkedOptions: state.messaging.checkedIds.length > 0,
    loaded: state.messaging.loaded,
    isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
    attachments: state.messaging.attachments,
})

export default compose(
    connect(
        mapStateToProps,
        {
            loadMessageConversations,
            setIsInFeedbackRecipientGroup,
            clearCheckedIds,
            setSelectedMessageConversation,
            setSelectedMessageType,
            clearSelectedMessageConversation,
            updateInputFields,
            setFilter,
            setDisplayTimeDiff,
            clearAttachments,
        },
        null,
        { pure: false }
    )
)(MessagingCenter)
