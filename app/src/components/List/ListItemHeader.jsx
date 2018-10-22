import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Subheader from 'material-ui/Subheader/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';

import i18n from 'd2-i18n';

import * as actions from 'constants/actions';
import theme from 'styles/theme';
import { fontFamily } from 'constants/development';

const fontSize = '16px';

const styles = {
    canvas(backgroundColor, wideview) {
        return {
            backgroundColor,
            display: 'grid',
            gridTemplateColumns: 'repeat(10, minmax(10px, 1fr))',
            transition: 'all 0.2s ease-in-out',
            boxSizing: 'border-box',
            position: 'relative',
            whiteSpace: 'nowrap',
            alignSelf: 'center',
        };
    },
    checkBox: {
        gridArea: '1 / 1',
        display: 'flex',
        alignSelf: 'center',
        marginLeft: '12px',
        width: '24px',
    },
    sender: {
        fontFamily,
        fontSize,
        gridArea: '1 / 1 / span 1 / span 2',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: 'black',
        marginLeft: '50px',
        paddingLeft: '0px',
        alignSelf: 'center',
    },
    subject: {
        gridArea: '1 / 3 / span 1 / span 3',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily,
        fontSize,
        color: 'black',
        paddingLeft: '10px',
    },
    extendedLabel(gridArea) {
        return {
            gridArea,
            color: 'black',
            fontSize,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        };
    },
};

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
        const displayExtendedChoices = this.props.displayExtendedChoices;

        return (
            <Paper style={styles.canvas(theme.palette.canvasColor, this.props.wideview)}>
                <Checkbox
                    checked={this.state.allChecked}
                    style={styles.checkBox}
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
                <div style={styles.sender}>{i18n.t('Sender')}</div>
                <Subheader style={styles.subject}>{i18n.t('Subject')}</Subheader>
                {displayExtendedChoices && (
                    <Subheader style={styles.extendedLabel('1 / 7')}>{i18n.t('Status')}</Subheader>
                )}
                {displayExtendedChoices && (
                    <Subheader style={styles.extendedLabel('1 / 8')}>
                        {i18n.t('Priority')}
                    </Subheader>
                )}
                {this.props.notification && (
                    <Subheader style={styles.extendedLabel('1 / 9')}>
                        {i18n.t('Assignee')}
                    </Subheader>
                )}
                <Subheader style={styles.extendedLabel('1 / 10')}>{i18n.t('Date')}</Subheader>
            </Paper>
        );
    }
}

export default compose(
    connect(
        state => ({
            checkedIds: state.messaging.checkedIds,
            isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
        }),
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
