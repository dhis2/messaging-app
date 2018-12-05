import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import Subheader from 'material-ui/Subheader/Subheader'
import MailIcon from 'material-ui-icons/MailOutline'

import i18n from 'd2-i18n'

import * as api from 'api/api'
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

import theme from 'styles/theme'

import MessageConversation from 'components/MessageConversation/MessageConversation'
import SidebarList from 'components/List/SidebarList'
import MessageConversationList from 'components/List/MessageConversationList'
import CreateMessage from 'components/MessageConversation/CreateMessage'
import Toolbar from 'components/Common/Toolbar'

import { subheader } from 'styles/style'

const EXTENDED_CHOICES = ['TICKET', 'VALIDATION_RESULT']
const autoRefreshTime = 300000
const subtractInterval = 10000

class MessagingCenter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            checkedItems: false,
            wideview: true,
            autoRefresh: false,
            timer: null,
            counter: autoRefreshTime,
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

        api.isInFeedbackRecipientGroup().then(result =>
            this.props.setIsInFeedbackRecipientGroup(result)
        )

        this.props.messageTypes.map(messageType =>
            this.props.loadMessageConversations(
                messageType,
                selectedMessageType
            )
        )

        this.props.setDisplayTimeDiff()

        setTimeout(() => {
            this.autoRefresh()
        }, autoRefreshTime)
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

    setAutoRefresh = autoRefresh => {
        !autoRefresh && clearInterval(this.state.timer)
        this.setState({
            autoRefresh,
            counter: !autoRefresh ? autoRefreshTime : this.state.counter,
            timer: !autoRefresh
                ? null
                : setInterval(this.tick.bind(this), subtractInterval),
        })
    }

    tick() {
        this.setState({
            counter: this.state.counter - subtractInterval,
        })
    }

    autoRefresh() {
        if (this.state.autoRefresh) {
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

        this.setState({ counter: autoRefreshTime })
        setTimeout(() => {
            this.autoRefresh()
        }, autoRefreshTime)
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
            <div className={'messaging-center'}>
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
                        counter={this.state.counter}
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
                              <div
                                  className={
                                      'messaging-center__no-message-selected'
                                  }
                              >
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

const mapStateToProps = state => ({
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
