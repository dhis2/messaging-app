import React, { Component } from 'react';
import { Subject, Observable } from 'rxjs/Rx';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import ChipInput from 'material-ui-chip-input'

import * as actions from 'constants/actions';

import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

const styles = {
  chip: { margin: 4 },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const searchDelay = 300;

/*
 * An AutoComplete text field with suggestions from a given list of
 * identifiable objects. Selected objects are shown as chips in the text field.
 */
class SuggestionField extends Component {
  state = {
  };

  constructor(props) {
    super(props)

    this.getRecipients( props )
    this.state = {
      input: '',
      selectedList: this.getRecipients( props )
    };
  }

  getRecipients( props ) {
    let recipients = []
    props.messageConversation && props.messageConversation.messages.map(message => {
      const doPush = _.find(recipients, { id: message.sender.id }) == undefined;
      doPush && recipients.push(message.sender)
    })

    return recipients
  }

  inputStream = new Subject();
  componentWillMount() {
    this.inputStream
      .debounce(() => Observable.timer(searchDelay))
      .subscribe((input) => {
        const doSearch = _.find(this.props.suggestions, { displayName: input }) == undefined;
        doSearch && input !== '' && this.props.searchForRecipients(input)
      });
  }

  componentWillReceiveProps( nextProps ) {
    this.setState({
      selectedList: this.getRecipients( nextProps )
    })
  }

  onSuggestionClick = (chip) => {
    this.wipeInput();
    this.inputStream.next('');

    const doInsert = _.find(this.state.selectedList, { id: chip.id }) == undefined;

    doInsert && this.setState({
      selectedList: [...this.state.selectedList, chip]
    })
  };

  onRemoveChip = (id) => {
    _.remove(this.state.selectedList, { id: id })

    this.setState({
      selectedList: this.state.selectedList
    })
  };

  wipeInput = () => {
    this.setState({
      input: '',
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
        value={this.state.selectedList}
        fullWidth
        searchText={this.state.input}
        floatingLabelText={this.props.label}
        dataSource={this.props.suggestions}
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
        suggestions: state.recipient.suggestions,
      };
    },
    dispatch => ({
      searchForRecipients: searchValue => dispatch({ type: actions.RECIPIENT_SEARCH, payload: { searchValue } }),
    }),
  ),
  pure,
)(SuggestionField);