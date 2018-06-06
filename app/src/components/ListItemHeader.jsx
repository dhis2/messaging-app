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

import { messageConversationContainer, subheader_minilist } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
import * as actions from 'constants/actions';
import { fontFamily } from '../constants/development';

const fontSize = '16px';

class MessageConversationListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cursor: 'auto',
            allChecked: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checkedIds.length < nextProps.children.length) {
            this.setState({ allChecked: false });
        }
    }

    render() {
        const displayExtendedChoices =
            this.props.displayExtendedChoices && this.props.isInFeedbackRecipientGroup;

        return (
            <Paper
                style={{
                    backgroundColor: theme.palette.canvasColor,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, minmax(10px, 1fr))',
                    gridTemplateRows: this.props.wideview ? '' : '15% 85%',
                    transition: 'all 0.2s ease-in-out',
                    boxSizing: 'border-box',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    alignSelf: 'center',
                }}
            >
                <Checkbox
                    checked={this.state.allChecked}
                    style={{
                        gridArea: '1 / 1',
                        display: 'flex',
                        alignSelf: 'center',
                        marginLeft: '12px',
                        width: '24px',
                    }}
                    onCheck={(event, isInputChecked) => {
                        this.state.allChecked
                            ? this.props.clearCheckedIds()
                            : this.props.setAllChecked(
                                  this.props.children.map(child => ({
                                      id: child.id,
                                  })),
                              );

                        this.setState({ allChecked: !this.state.allChecked });
                    }}
                />
                <div
                    style={{
                        fontFamily: fontFamily,
                        fontSize: fontSize,
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
                        fontSize: fontSize,
                        color: 'black',
                        paddingLeft: '10px',
                    }}
                >
                    {'Subject'}
                </Subheader>

                {displayExtendedChoices && (
                    <Subheader
                        style={{
                            gridArea: '1 / 7',
                            color: 'black',
                            fontSize: fontSize,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {'Status'}
                    </Subheader>
                )}

                {displayExtendedChoices && (
                    <Subheader
                        style={{
                            gridArea: '1 / 8',
                            color: 'black',
                            fontSize: fontSize,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {'Priority'}
                    </Subheader>
                )}
                {displayExtendedChoices && (
                    <Subheader
                        style={{
                            gridArea: '1 / 9',
                            color: 'black',
                            fontSize: fontSize,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {'Assignee'}
                    </Subheader>
                )}

                <Subheader
                    style={{
                        gridArea: '1 / 10',
                        fontFamily: fontFamily,
                        fontSize: fontSize,
                        color: 'black',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
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
                checkedIds: state.messaging.checkedIds,
                isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
            };
        },
        dispatch => ({
            setAllChecked: messageConversationIds =>
                dispatch({
                    type: actions.SET_ALL_CHECKED,
                    payload: { messageConversationIds },
                }),
            clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
        }),
    ),
)(MessageConversationListItem);
