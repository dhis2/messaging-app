import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader/Subheader';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import MessageTypeItem from './MessageTypeItem';

import theme from '../styles/theme';
import * as actions from 'constants/actions';
import history from 'utils/history';

class SidebarList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.setSelectedMessageType(this.props.match.params.messageType);
    }

    render() {
        const gridColumn = this.props.gridColumn;
        const messageType = this.props.match.params.messageType;
        const relativePath = gridColumn == 1 ? '/' : '/' + messageType + '/';
        const messageTypes = this.props.messageTypes;

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100vh - 95px)',
                    gridArea: '2 / ' + gridColumn + ' / span 1 / span 1',
                    borderLeftStyle: gridColumn == 2 && 'solid',
                    borderLeftWidth: '0.5px',
                    borderLeftColor: theme.palette.accent4Color,
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: theme.palette.accent4Color,
                    overflowY: 'scroll',
                }}
            >
                <div>
                    <List
                        style={{
                            padding: '0px',
                            height: 'calc(100vh - 100px)',
                        }}
                    >
                        {messageTypes &&
                            messageTypes.map(messageType => {
                                return (
                                    <div key={messageType.id}>
                                        <MessageTypeItem
                                            messageType={messageType}
                                            onClick={() => {
                                                this.props.setSelectedMessageType(messageType.id);
                                                history.push('/' + messageType.id);
                                            }}
                                            selectedMessageType={this.props.selectedMessageType}
                                            loading={messageType.loading}
                                        />
                                        <Divider />
                                    </div>
                                );
                            })}
                    </List>
                </div>
            </div>
        );
    }
}

export default compose(
    connect(
        state => {
            return {
                selectedMessageType: state.messaging.selectedMessageType,
                messageTypes: state.messaging.messageTypes,
            };
        },
        dispatch => ({
            setSelectedMessageType: messageTypeId =>
                dispatch({ type: actions.SET_SELECTED_MESSAGE_TYPE, payload: { messageTypeId } }),
            clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
        }),
    ),
    pure,
)(SidebarList);
