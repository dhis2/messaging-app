import React, { Component } from 'react';
import { Subject, Observable } from 'rxjs/Rx';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import ChipInput from 'material-ui-chip-input'

import * as actions from 'constants/actions';
import * as api from 'api/api';

import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

const searchDelay = 300;

/*
 * An AutoComplete text field with suggestions from a given list of
 * identifiable objects. Selected objects are shown as chips in the text field.
 */
class SuggestionField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: '',
      searchResult: [],
    };
  }

  onSearchRequest = key =>
    this.state.api.get('sharing/search', { key })
      .then(searchResult => searchResult);

  inputStream = new Subject();
  componentWillMount() {
    this.inputStream
      .debounce(() => Observable.timer(searchDelay))
      .subscribe((input) => {
        const doSearch = _.find(this.state.searchResult, { displayName: input }) == undefined;
        doSearch && input !== '' &&
          api.searchRecipients(input)
            .then(({ users, userGroups, organisationUnits }) => {
              const addType = type => result => ({ ...result, type });
              const searchResult = users
                .map(addType('user'))
                .concat(userGroups.map(addType('userGroup')))
                .concat(organisationUnits.map(addType('organisationUnit')))

              this.setState({
                searchResult: searchResult,
              })
            });
      });
  }

  onSuggestionClick = (chip) => {
    log(chip, this.props.onSuggestionClick)
    if (this.props.onSuggestionClick != undefined) {
      this.props.onSuggestionClick(chip)
    } else {
      this.wipeInput();
      this.inputStream.next('');

      const doInsert = _.find(this.props.recipients, { 'id': chip.id }) == undefined;

      doInsert && this.props.updateRecipients([...this.props.recipients, _.find(this.state.searchResult, { 'id': chip.id })])
    }
  };

  onRemoveChip = (id) => {
    _.remove(this.props.recipients, { id: id })

    this.props.updateRecipients(this.props.recipients)
  };

  wipeInput = () => {
    this.setState({
      input: '',
      searchResult: []
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
        style={{ marginBottom: 16 }}
        value={this.props.recipients}
        fullWidth
        openOnFocus={true}
        searchText={this.state.input}
        floatingLabelText={this.props.label}
        dataSource={this.state.searchResult}
        dataSourceConfig={{ text: 'displayName', value: 'id' }}
        onUpdateInput={this.updateInput}
        onRequestAdd={(chip) => this.onSuggestionClick(chip)}
        onRequestDelete={(id) => this.onRemoveChip(id)}
      />
    )
  }
}

export default compose(
  connect(
    state => {
      return {
      };
    },
    dispatch => ({
    }),
    null,
    { pure: false }
  ),
)(SuggestionField);