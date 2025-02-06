import i18n from '@dhis2/d2-i18n'
import Badge from 'material-ui/Badge'
import CircularProgress from 'material-ui/CircularProgress'
import Subheader from 'material-ui/Subheader/Subheader'
import propTypes from 'prop-types'
import React, { Component } from 'react'
import theme from '../../styles/theme.js'

class MessageTypeItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            backgroundColor: theme.palette.accent2Color,
            textColor: theme.palette.darkGray,
        }
    }

    onClick = () => {
        this.props.onClick()
    }

    onMouseEnter = () => {
        this.setHoverText()
        this.setState({ cursor: 'pointer' })
    }
    onMouseLeave = () => {
        this.setNeutralText()
        this.setState({ cursor: 'auto' })
    }

    setNeutralText = () => this.setTextColor(theme.palette.accent2Color)
    setHoverText = () => this.setTextColor(theme.palette.accent3Color)

    setTextColor = (color) => {
        this.setState({
            backgroundColor: color,
        })
    }

    getBackgroundColor = (selectedValue, id) =>
        selectedValue && id === selectedValue.id
            ? theme.palette.accent3Color
            : this.state.backgroundColor

    render() {
        return (
            <div
                role="presentation"
                style={{
                    ...this.state,
                    backgroundColor: this.getBackgroundColor(
                        this.props.selectedMessageType,
                        this.props.messageType.id
                    ),
                    cursor: this.state.cursor,
                    alignItems: 'center',
                    height: '49px',
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
                            this.props.messageType.id ===
                                this.props.selectedMessageType.id
                                ? '18px'
                                : '16px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color:
                            this.props.selectedMessageType &&
                            this.props.messageType.id ===
                                this.props.selectedMessageType.id
                                ? theme.palette.primary1Color
                                : this.state.textColor,
                    }}
                >
                    {i18n.t(this.props.messageType.displayName)}
                </Subheader>
                {this.props.loading ? (
                    <CircularProgress
                        style={{ marginRight: '10px' }}
                        color={theme.palette.primary1Color}
                        size={24}
                    />
                ) : (
                    this.props.messageType.unread > 0 && (
                        <Badge
                            style={{ marginTop: '12px', marginRight: '5px' }}
                            badgeContent={
                                this.props.messageType.unread > 100
                                    ? '99+'
                                    : this.props.messageType.unread
                            }
                            secondary
                            badgeStyle={{ backgroundColor: '#439E8E' }}
                        />
                    )
                )}
            </div>
        )
    }
}

MessageTypeItem.propTypes = {
    loading: propTypes.bool,
    messageType: propTypes.object,
    selectedMessageType: propTypes.object,
    onClick: propTypes.func,
}

export default MessageTypeItem
