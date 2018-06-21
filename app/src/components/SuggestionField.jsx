import React, { Component } from 'react';

import { Subject, Observable } from 'rxjs/Rx';
import ChipInput from 'material-ui-chip-input';

import * as api from 'api/api';

const find = require('lodash/find');
const remove = require('lodash/remove');
const searchDelay = 300;

/*
 * An AutoComplete text field with suggestions from a given list of
 * identifiable objects. Selected objects are shown as chips in the text field.
 */
class SuggestionField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: '',
            searchResult: [],
            searchOnlyUsers: this.props.searchOnlyUsers,
            lastSearch: '',
        };
    }

    inputStream = new Subject();
    componentWillMount = () => {
        this.inputStream.debounce(() => Observable.timer(searchDelay)).subscribe(input => {
            const doSearch =
                find(this.state.searchResult, { displayName: input }) === undefined &&
                input !== '' &&
                input.length > 2;

            if (doSearch) {
                api.searchRecipients(input).then(({ users, userGroups, organisationUnits }) => {
                    const addType = type => result => ({ ...result, type });

                    let searchResult = users.map(addType('user'));

                    if (!this.state.searchOnlyUsers) {
                        searchResult = searchResult
                            .concat(userGroups.map(addType('userGroup')))
                            .concat(organisationUnits.map(addType('organisationUnit')));
                    }

                    this.setState({
                        searchResult,
                    });
                });
            }

            this.setState({
                lastSearch: input,
                searchResult:
                    this.state.lastSearch !== '' && input === '' ? [] : this.state.searchResult,
            });
        });
    };

    onSuggestionClick = chip => {
        if (this.props.onSuggestionClick !== undefined) {
            this.props.onSuggestionClick(chip);
        } else {
            this.wipeInput();
            this.inputStream.next('');

            const doInsert = find(this.props.recipients, { id: chip.id }) === undefined;

            doInsert &&
                this.props.updateRecipients([
                    ...this.props.recipients,
                    find(this.state.searchResult, { id: chip.id }),
                ]);
        }
    };

    onRemoveChip = id => {
        remove(this.props.recipients, { id });
        this.props.updateRecipients(this.props.recipients);
    };

    wipeInput = () => {
        this.setState({
            input: '',
            searchResult: [],
        });
    };

    updateInput = input => {
        this.inputStream.next(input);
        this.setState({
            input,
        });
    };

    render() {
        return (
            <ChipInput
                style={{
                    marginBottom: '16px',
                    ...this.props.style,
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                }}
                disabled={this.props.disabled === undefined ? false : this.props.disabled}
                errorText={this.props.errorText}
                value={this.props.recipients}
                fullWidth
                openOnFocus
                searchText={this.state.input}
                floatingLabelText={this.props.label}
                dataSource={this.state.searchResult}
                dataSourceConfig={{ text: 'displayName', value: 'id' }}
                onUpdateInput={this.updateInput}
                onRequestAdd={chip => this.onSuggestionClick(chip)}
                onRequestDelete={id => this.onRemoveChip(id)}
            />
        );
    }
}

export default SuggestionField;
