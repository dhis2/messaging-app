import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import Message from './Message';
import ReplyCard from './ReplyCard';
import CustomFontIcon from './CustomFontIcon';
import ToolbarExtendedChoicePicker from './ToolbarExtendedChoicePicker';
import ExtendedInformation from './ExtendedInformation';

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

    render() {
        const displayExtendedChoices = this.props.displayExtendedChoices;

        return (
            <Paper
                style={{
                    backgroundColor: this.state.backgroundColor,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gridTemplateRows: this.props.wideview ? '' : '15% 85%',
                    transition: 'all 0.2s ease-in-out',
                    boxSizing: 'border-box',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    alignSelf: 'center',
                }}
            >
                <div
                    style={{
                        fontFamily: fontFamily,
                        fontSize: '14px',
                        gridArea: '1 / 1 / span 1 / span 2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'black',
                        marginLeft: '50px',
                        paddingLeft: '0px',
                        alignSelf: 'center',
                    }}
                >
                    {'Sender'}
                </div>

                <Subheader
                    style={{
                        gridArea: '1 / 3 / span 1 / span 1',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: fontFamily,
                        color: 'black',
                        paddingLeft: '10px',
                    }}
                >
                    {'Subject'}
                </Subheader>

                {displayExtendedChoices &&
                    this.props.isInFeedbackRecipientGroup && (
                        <div
                            style={{
                                gridArea: '1 / 7 / span 1 / span 3',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                            }}
                        >
                            <Subheader
                                style={{ gridArea: '1 / 1', color: 'black', overflow: 'hidden' }}
                            >
                                {'Status'}
                            </Subheader>
                            <Subheader
                                style={{
                                    gridArea: '1 / 2',
                                    color: 'black',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {'Priority'}
                            </Subheader>
                            <Subheader
                                style={{ gridArea: '1 / 3', color: 'black', whiteSpace: 'nowrap' }}
                            >
                                {'Assignee'}
                            </Subheader>
                        </div>
                    )}
                <Subheader
                    style={{
                        gridArea: '1 / 10',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        paddingRight: '10px',
                        fontFamily: fontFamily,
                        color: 'black',
                    }}
                >
                    {'Date'}
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
                numberOfCheckedIds: state.messaging.checkedIds.length,
                isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
            };
        },
        dispatch => ({}),
    ),
)(MessageConversationListItem);
