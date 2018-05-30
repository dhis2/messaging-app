import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';

import CircularProgress from 'material-ui/CircularProgress';
import Badge from 'material-ui/Badge';
import Subheader from 'material-ui/Subheader/Subheader';

import CustomFontIcon from './CustomFontIcon';

import theme from '../styles/theme';
import history from 'utils/history';
import { headerPositions } from '../styles/style';

class MessageTypeItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            backgroundColor: theme.palette.accent2Color,
        };
    }

    setBackgroundColorcolor = () => {
        this.setState({
            backgroundColor: color,
            cursor: 'auto',
        });
    };

    getBackgroundColor = (selectedValue, id) =>
        selectedValue && id == selectedValue.id
            ? theme.palette.accent3Color
            : this.state.backgroundColor;

    setNeutral = () => this.setBackgroundColor(theme.palette.accent2Color);
    setFocus = () => this.setBackgroundColor('#e4e4e4');
    setHover = () => this.setBackgroundColor(theme.palette.accent3Color);

    onClick = () => {
        this.props.onClick();
    };

    onMouseEnter = () => this.setState({ cursor: 'pointer' });
    onMouseLeave = () => this.setState({ cursor: 'auto' });

    render() {
        return (
            <div
                style={{
                    ...this.state,
                    backgroundColor: this.getBackgroundColor(
                        this.props.selectedMessageType,
                        this.props.messageType.id,
                    ),
                    cursor: this.state.cursor,
                    alignItems: 'center',
                    height: '48px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onClick={() => this.onClick()}
            >
                <Subheader
                    style={{
                        marginLeft: '5px',
                        fontSize:
                            this.props.selectedMessageType &&
                            this.props.messageType.id == this.props.selectedMessageType.id
                                ? '18px'
                                : '16px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color:
                            this.props.selectedMessageType &&
                            this.props.messageType.id == this.props.selectedMessageType.id
                                ? theme.palette.primary1Color
                                : theme.palette.accent4Color,
                    }}
                >
                    {this.props.messageType.displayName}
                </Subheader>
                {this.props.loading ? (
                    <CircularProgress
                        style={{ marginRight: '10px' }}
                        color={theme.palette.primary2Color}
                    />
                ) : (
                    this.props.messageType.unread > 0 && (
                        <Badge
                            style={{ marginTop: '12px', marginRight: '5px' }}
                            badgeContent={this.props.messageType.unread}
                            secondary={true}
                            badgeStyle={{ backgroundColor: '#439E8E' }}
                        />
                    )
                )}
            </div>
        );
    }
}

export default MessageTypeItem;
