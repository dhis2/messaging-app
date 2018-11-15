import React, { Component } from 'react'

import ViewFancy from 'material-ui-icons/ViewList'
import ViewList from 'material-ui-icons/ViewHeadline'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import CreateMessageIcon from 'material-ui-icons/Add'
import NavigationBack from 'material-ui-icons/ArrowBack'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Subheader from 'material-ui/Subheader'

import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import i18n from 'd2-i18n'

import history from 'utils/history'

import theme from 'styles/theme'

import extendedChoices from 'constants/extendedChoices'
import ToolbarExtendedChoicePicker from 'components/Common/ToolbarExtendedChoicePicker'

import { debounce } from '../../utils/helpers'

const headerHeight = '48px'
const searchDelay = 300

const styles = {
    canvas(checkedOptions) {
        return {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: checkedOptions
                ? theme.palette.blue50
                : theme.palette.accent2Color,
            zIndex: 10,
        }
    },
    checkedOption: {
        display: 'flex',
        justifyContent: 'flex-start',
        minWidth: '200px',
        margin: '6px 0',
    },
    filterControl: {
        flex: 2,
        height: headerHeight,
        marginRight: 16,
        maxWidth: 256,
    },
    rightHandCanvas: {
        flex: '2 0',
        display: 'flex',
        paddingLeft: 16,
    },
    // IE11 has buggy support for `justifyContent: flex-end;`
    // to achieve the same result we use a spacer div
    ie11Spacer: {
        flexGrow: 1,
    },
    iconMenu: {
        width: '30px',
        display: 'flex',
    },
}

class Toolbar extends Component {
    state = {
        lastMessageFilter: '',
    }
    debouncedSearch = debounce(this.search, searchDelay)

    search(messageFilter) {
        if (
            this.props.selectedMessageType &&
            this.state.lastMessageFilter !== messageFilter
        ) {
            this.props.loadMessageConversations(
                this.props.selectedMessageType,
                this.props.selectedMessageType.id
            )
            this.setState({ lastMessageFilter: messageFilter })
        }
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.selectedMessageType &&
            this.props.selectedMessageType.id !==
                prevProps.selectedMessageType.id
        ) {
            this.debouncedSearch('')
            this.props.messageFilter !== undefined &&
                this.props.setFilter(undefined, 'MESSAGE')
            this.props.statusFilter !== undefined &&
                this.props.setFilter(undefined, 'STATUS')
            this.props.priorityFilter !== undefined &&
                this.props.setFilter(undefined, 'PRIORITY')
            this.props.assignedToMeFilter &&
                this.props.setFilter(false, 'ASSIGNED_TO_ME')
            this.props.markedForFollowUpFilter &&
                this.props.setFilter(false, 'MARKED_FOR_FOLLOWUP')
            this.props.unreadFilter && this.props.setFilter(false, 'UNREAD')
        }

        if (
            this.props.selectedMessageType !== undefined &&
            !this.props.selectedMessageType.loading &&
            (prevProps.statusFilter !== this.props.statusFilter ||
                prevProps.priorityFilter !== this.props.priorityFilter ||
                prevProps.assignedToMeFilter !==
                    this.props.assignedToMeFilter ||
                prevProps.markedForFollowUpFilter !==
                    this.props.markedForFollowUpFilter ||
                prevProps.unreadFilter !== this.props.unreadFilter ||
                prevProps.selectedMessageType === undefined ||
                prevProps.selectedMessageType.id !==
                    this.props.selectedMessageType.id)
        ) {
            this.props.loadMessageConversations(
                this.props.selectedMessageType,
                this.props.selectedMessageType.id
            )
        }
    }

    render() {
        const id = this.props.id
        const displayExtendedChoices = this.props.displayExtendedChoices
        const checkedOptions = this.props.checkedOptions

        const displaySearch =
            !this.props.wideview ||
            (this.props.selectedMessageConversation === undefined &&
                id !== 'create')

        return (
            <Paper style={styles.canvas(checkedOptions)}>
                <div>
                    {!checkedOptions && (
                        <FlatButton
                            style={styles.checkedOption}
                            icon={<CreateMessageIcon />}
                            onClick={() => history.push('/PRIVATE/create')}
                            label={i18n.t('Compose')}
                        />
                    )}

                    {checkedOptions && (
                        <FlatButton
                            style={styles.checkedOption}
                            icon={<NavigationBack />}
                            onClick={() => this.props.clearCheckedIds()}
                            label={i18n.t('Deselect all')}
                        />
                    )}
                </div>

                <ToolbarExtendedChoicePicker
                    displayExtendedChoices={displayExtendedChoices}
                />

                <div style={styles.rightHandCanvas}>
                    <div style={styles.ie11Spacer} />
                    {displayExtendedChoices &&
                        displaySearch &&
                        !checkedOptions && (
                            <SelectField
                                style={styles.filterControl}
                                labelStyle={{
                                    color:
                                        this.props.statusFilter === undefined
                                            ? 'lightGray'
                                            : 'black',
                                    top:
                                        this.props.statusFilter === undefined
                                            ? '-15px'
                                            : '-2px',
                                }}
                                selectedMenuItemStyle={{
                                    color: theme.palette.primary1Color,
                                }}
                                floatingLabelText={
                                    this.props.statusFilter === undefined
                                        ? i18n.t('Status')
                                        : ''
                                }
                                floatingLabelStyle={{
                                    top: '15px',
                                }}
                                iconStyle={{
                                    top:
                                        this.props.statusFilter === undefined
                                            ? '-15px'
                                            : '0px',
                                }}
                                value={this.props.statusFilter}
                                onChange={(event, key, payload) => {
                                    this.props.setFilter(
                                        payload === null ? undefined : payload,
                                        'STATUS'
                                    )
                                }}
                            >
                                <MenuItem
                                    key={null}
                                    value={null}
                                    primaryText={''}
                                />
                                {extendedChoices.STATUS.map(elem => (
                                    <MenuItem
                                        key={elem.key}
                                        value={elem.value}
                                        primaryText={elem.primaryText}
                                    />
                                ))}
                            </SelectField>
                        )}

                    {displayExtendedChoices &&
                        displaySearch &&
                        !checkedOptions && (
                            <SelectField
                                style={styles.filterControl}
                                labelStyle={{
                                    color:
                                        this.props.priorityFilter === undefined
                                            ? 'lightGray'
                                            : 'black',
                                    top:
                                        this.props.priorityFilter === undefined
                                            ? '-15px'
                                            : '-2px',
                                }}
                                selectedMenuItemStyle={{
                                    color: theme.palette.primary1Color,
                                }}
                                floatingLabelText={
                                    this.props.priorityFilter === undefined
                                        ? i18n.t('Priority')
                                        : ''
                                }
                                floatingLabelStyle={{
                                    top: '15px',
                                }}
                                iconStyle={{
                                    top:
                                        this.props.priorityFilter === undefined
                                            ? '-15px'
                                            : '0px',
                                }}
                                value={this.props.priorityFilter}
                                onChange={(event, key, payload) => {
                                    this.props.setFilter(
                                        payload === null ? undefined : payload,
                                        'PRIORITY'
                                    )
                                }}
                            >
                                <MenuItem
                                    key={null}
                                    value={null}
                                    primaryText={''}
                                />
                                {extendedChoices.PRIORITY.map(elem => (
                                    <MenuItem
                                        key={elem.key}
                                        value={elem.value}
                                        primaryText={elem.primaryText}
                                    />
                                ))}
                            </SelectField>
                        )}

                    {!checkedOptions &&
                        displaySearch && (
                            <TextField
                                style={styles.filterControl}
                                fullWidth
                                hintText={i18n.t('Search')}
                                value={this.props.messageFilter || ''}
                                onChange={(event, messageFilter) => {
                                    this.debouncedSearch(messageFilter)
                                    this.props.setFilter(
                                        messageFilter,
                                        'MESSAGE'
                                    )
                                }}
                                type="search"
                            />
                        )}

                    {!checkedOptions &&
                        displaySearch && (
                            <IconMenu
                                iconButtonElement={
                                    <IconButton>
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                anchorOrigin={{
                                    horizontal: 'right',
                                    vertical: 'top',
                                }}
                                targetOrigin={{
                                    horizontal: 'right',
                                    vertical: 'top',
                                }}
                                style={styles.iconMenu}
                                menuStyle={{ overflowX: 'hidden' }}
                            >
                                <Subheader style={{ padding: '0px 16px' }}>
                                    {i18n.t('Set filter')}
                                </Subheader>
                                {this.props.displayExtendedChoices && (
                                    <Checkbox
                                        style={{ padding: '0px 16px' }}
                                        key={'assignedToMeFilter'}
                                        label={i18n.t('Assigned to me')}
                                        checked={this.props.assignedToMeFilter}
                                        onClick={() => {
                                            this.props.setFilter(
                                                !this.props.assignedToMeFilter,
                                                'ASSIGNED_TO_ME'
                                            )
                                        }}
                                    />
                                )}
                                <Checkbox
                                    style={{ padding: '0px 16px' }}
                                    key={'markedForFollowUpFilter'}
                                    label={i18n.t('Marked for followup')}
                                    checked={this.props.markedForFollowUpFilter}
                                    onClick={() => {
                                        this.props.setFilter(
                                            !this.props.markedForFollowUpFilter,
                                            'MARKED_FOR_FOLLOWUP'
                                        )
                                    }}
                                />
                                <Checkbox
                                    style={{ padding: '0px 16px' }}
                                    key={'unreadFilter'}
                                    label={i18n.t('Unread messages')}
                                    checked={this.props.unreadFilter}
                                    onClick={() => {
                                        this.props.setFilter(
                                            !this.props.unreadFilter,
                                            'UNREAD'
                                        )
                                    }}
                                />
                            </IconMenu>
                        )}
                    <FlatButton
                        style={{
                            width: '50px',
                            alignSelf: 'center',
                        }}
                        icon={
                            !this.props.wideview ? <ViewList /> : <ViewFancy />
                        }
                        onClick={() => this.props.toogleWideview()}
                    />
                </div>
            </Paper>
        )
    }
}

export default Toolbar
