import React, { Component } from 'react';
import { Subject, Observable } from 'rxjs/Rx';

import ViewFancy from 'material-ui-icons/ViewList';
import ViewList from 'material-ui-icons/ViewHeadline';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import CreateMessageIcon from 'material-ui-icons/Add';
import NavigationBack from 'material-ui-icons/ArrowBack';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox/Checkbox';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import i18n from 'd2-i18n';

import history from 'utils/history';

import { grid } from '../styles/style';
import theme from '../styles/theme';

import extendedChoices from '../constants/extendedChoices';
import ToolbarExtendedChoicePicker from './ToolbarExtendedChoicePicker';

const headerHight = '48px';
const searchDelay = 300;

class Toolbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lastMessageFilter: '',
        };
    }

    inputStream = new Subject();
    componentWillMount() {
        this.inputStream.debounce(() => Observable.timer(searchDelay)).subscribe(messageFilter => {
            if (this.props.selectedMessageType && this.state.lastMessageFilter !== messageFilter) {
                this.props.loadMessageConversations(
                    this.props.selectedMessageType,
                    this.props.selectedMessageType.id,
                    messageFilter,
                    this.props.statusFilter,
                    this.props.priorityFilter,
                );
                this.setState({ lastMessageFilter: messageFilter });
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.selectedMessageType &&
            this.props.selectedMessageType.id !== prevProps.selectedMessageType.id
        ) {
            this.inputStream.next('');
            this.props.messageFilter !== undefined && this.props.setFilter(undefined, 'MESSAGE');
            this.props.statusFilter !== undefined && this.props.setFilter(undefined, 'STATUS');
            this.props.priorityFilter !== undefined && this.props.setFilter(undefined, 'PRIORITY');
            this.props.assignedToMeFilter && this.props.setFilter(false, 'ASSIGNED_TO_ME');
            this.props.markedForFollowUpFilter &&
                this.props.setFilter(false, 'MARKED_FOR_FOLLOWUP');
            this.props.unreadFilter && this.props.setFilter(false, 'UNREAD');
        }

        if (
            this.props.selectedMessageType !== undefined &&
            !this.props.selectedMessageType.loading &&
            (prevProps.statusFilter !== this.props.statusFilter ||
                prevProps.priorityFilter !== this.props.priorityFilter ||
                prevProps.assignedToMeFilter !== this.props.assignedToMeFilter ||
                prevProps.markedForFollowUpFilter !== this.props.markedForFollowUpFilter ||
                prevProps.unreadFilter !== this.props.unreadFilter ||
                prevProps.selectedMessageType === undefined ||
                prevProps.selectedMessageType.id !== this.props.selectedMessageType.id)
        ) {
            this.props.loadMessageConversations(
                this.props.selectedMessageType,
                this.props.selectedMessageType.id,
            );
        }
    }

    render() {
        const id = this.props.id;
        const displayExtendedChoices = this.props.displayExtendedChoices;
        const checkedOptions = this.props.checkedOptions;

        const displaySearch =
            !this.props.wideview ||
            (this.props.selectedMessageConversation === undefined && id !== 'create');

        return (
            <Paper
                style={{
                    gridArea: '1 / 1 / span 1 / span 10',
                    display: 'grid',
                    gridTemplateColumns: grid.gridTemplateColumns,
                    backgroundColor: checkedOptions
                        ? theme.palette.blue50
                        : theme.palette.accent2Color,
                    zIndex: 10,
                }}
            >
                <div style={{ width: '200px', gridArea: '1 / 1', alignSelf: 'center' }}>
                    {!checkedOptions && (
                        <FlatButton
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                minWidth: '200px',
                            }}
                            icon={<CreateMessageIcon />}
                            onClick={() => history.push('/PRIVATE/create')}
                            label={i18n.t('Compose')}
                        />
                    )}

                    {checkedOptions && (
                        <FlatButton
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                minWidth: '200px',
                            }}
                            icon={<NavigationBack />}
                            onClick={() => this.props.clearCheckedIds()}
                            label={i18n.t('Deselect all')}
                        />
                    )}
                </div>

                <ToolbarExtendedChoicePicker displayExtendedChoices={displayExtendedChoices} />

                {displayExtendedChoices &&
                    displaySearch &&
                    !checkedOptions && (
                        <SelectField
                            style={{
                                height: headerHight,
                                gridArea: '1 / 7',
                                marginRight: '10px',
                                width: '95%',
                            }}
                            labelStyle={{
                                color:
                                    this.props.statusFilter === undefined ? 'lightGray' : 'black',
                                top: this.props.statusFilter === undefined ? '-15px' : '-2px',
                            }}
                            selectedMenuItemStyle={{ color: theme.palette.primary1Color }}
                            floatingLabelText={
                                this.props.statusFilter === undefined ? i18n.t('Status') : ''
                            }
                            floatingLabelStyle={{
                                top: '15px',
                            }}
                            iconStyle={{
                                top: this.props.statusFilter === undefined ? '-15px' : '0px',
                            }}
                            value={this.props.statusFilter}
                            onChange={(event, key, payload) => {
                                this.props.setFilter(
                                    payload === null ? undefined : payload,
                                    'STATUS',
                                );
                            }}
                        >
                            <MenuItem key={null} value={null} primaryText={''} />
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
                            style={{
                                height: headerHight,
                                gridArea: '1 / 8',
                                marginRight: '10px',
                                width: '95%',
                            }}
                            labelStyle={{
                                color:
                                    this.props.priorityFilter === undefined ? 'lightGray' : 'black',
                                top: this.props.priorityFilter === undefined ? '-15px' : '-2px',
                            }}
                            selectedMenuItemStyle={{ color: theme.palette.primary1Color }}
                            floatingLabelText={
                                this.props.priorityFilter === undefined ? i18n.t('Priority') : ''
                            }
                            floatingLabelStyle={{
                                top: '15px',
                            }}
                            iconStyle={{
                                top: this.props.priorityFilter === undefined ? '-15px' : '0px',
                            }}
                            value={this.props.priorityFilter}
                            onChange={(event, key, payload) => {
                                this.props.setFilter(
                                    payload === null ? undefined : payload,
                                    'PRIORITY',
                                );
                            }}
                        >
                            <MenuItem key={null} value={null} primaryText={''} />
                            {extendedChoices.PRIORITY.map(elem => (
                                <MenuItem
                                    key={elem.key}
                                    value={elem.value}
                                    primaryText={elem.primaryText}
                                />
                            ))}
                        </SelectField>
                    )}

                <div
                    style={{
                        gridArea: '1 / 9 / span 1 / span 2',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                    }}
                >
                    {!checkedOptions &&
                        displaySearch && (
                            <TextField
                                style={{
                                    height: headerHight,
                                    gridArea: '1 / 1 / span 1 / span 7',
                                }}
                                fullWidth
                                hintText={i18n.t('Search')}
                                value={this.props.messageFilter}
                                onChange={(event, messageFilter) => {
                                    this.inputStream.next(messageFilter);
                                    this.props.setFilter(messageFilter, 'MESSAGE');
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
                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                                style={{
                                    gridArea: '1 / 9 / span 1 / span 1',
                                    width: '30px',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Subheader style={{ padding: '0px 16px' }}>
                                    {i18n.t('Set filter')}
                                </Subheader>
                                <Checkbox
                                    style={{ padding: '0px 16px' }}
                                    key={'assignedToMeFilter'}
                                    label={i18n.t('Assigned to me')}
                                    checked={this.props.assignedToMeFilter}
                                    onClick={() => {
                                        this.props.setFilter(
                                            !this.props.assignedToMeFilter,
                                            'ASSIGNED_TO_ME',
                                        );
                                    }}
                                />
                                <Checkbox
                                    style={{ padding: '0px 16px' }}
                                    key={'markedForFollowUpFilter'}
                                    label={i18n.t('Marked for followup')}
                                    checked={this.props.markedForFollowUpFilter}
                                    onClick={() => {
                                        this.props.setFilter(
                                            !this.props.markedForFollowUpFilter,
                                            'MARKED_FOR_FOLLOWUP',
                                        );
                                    }}
                                />
                                <Checkbox
                                    style={{ padding: '0px 16px' }}
                                    key={'unreadFilter'}
                                    label={i18n.t('Unread messages')}
                                    checked={this.props.unreadFilter}
                                    onClick={() => {
                                        this.props.setFilter(!this.props.unreadFilter, 'UNREAD');
                                    }}
                                />
                            </IconMenu>
                        )}
                    <FlatButton
                        style={{
                            gridArea: '1 / 10 / span 1 / span 1',
                            width: '50px',
                            alignSelf: 'center',
                        }}
                        icon={!this.state.wideview ? <ViewList /> : <ViewFancy />}
                        onClick={() => this.props.toogleWideview()}
                    />
                </div>
            </Paper>
        );
    }
}

export default Toolbar;
