import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { List } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Toggle from 'material-ui/Toggle'
import i18n from '@dhis2/d2-i18n'
import history from '../../utils/history'
import { setSelectedMessageType, clearCheckedIds } from '../../actions'
import MessageTypeItem from './MessageTypeItem'
import theme from '../../styles/theme'
import moment from 'moment'

const styles = {
    canvas: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100vh - 95px)',
        borderLeftStyle: 'solid',
        borderLeftWidth: '0.5px',
        borderLeftColor: theme.palette.accent4Color,
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: theme.palette.accent4Color,
        overflowY: 'auto',
        overflowX: 'hidden',
        minWidth: '200px',
    },
}

class SidebarList extends Component {
    constructor(props) {
        super(props)
        this.props.setSelectedMessageType(this.props.match.params.messageType)
    }

    render() {
        const messageTypes = this.props.messageTypes

        return (
            <div style={styles.canvas}>
                <List
                    style={{
                        padding: '0px',
                    }}
                >
                    {messageTypes &&
                        messageTypes.map(messageType => (
                            <div key={messageType.id}>
                                <MessageTypeItem
                                    messageType={messageType}
                                    onClick={() => {
                                        this.props.setSelectedMessageType(
                                            messageType.id
                                        )
                                        this.props.updateInputFields('', '', [])
                                        this.props.attachments.length > 0 &&
                                            this.props.clearAttachments()
                                        history.push(`/${messageType.id}`)
                                    }}
                                    selectedMessageType={
                                        this.props.selectedMessageType
                                    }
                                    loading={messageType.loading}
                                />
                                <Divider />
                            </div>
                        ))}
                </List>
                <Toggle
                    style={{ width: '', margin: '20px' }}
                    label={`${i18n.t('Auto refresh')} (${moment(
                        this.props.refreshTimer
                    ).format('mm:ss')})`}
                    toggled={this.props.autoRefresh}
                    onToggle={() =>
                        this.props.setAutoRefresh(!this.props.autoRefresh)
                    }
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    selectedMessageType: state.messaging.selectedMessageType,
    messageTypes: state.messaging.messageTypes,
})

export default compose(
    connect(
        mapStateToProps,
        {
            setSelectedMessageType,
            clearCheckedIds,
        },
        null,
        { pure: false }
    )
)(SidebarList)
