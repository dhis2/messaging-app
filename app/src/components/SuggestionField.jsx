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

    this.props.setSelected( this.getRecipients( props ) )
    this.state = {
      input: '',
    };
  }

  getRecipients( props ) {
    let selected = []
    props.messageConversation && props.messageConversation.messages.map(message => {
      const doPush = _.find(selected, { id: message.sender.id }) == undefined;
      doPush && selected.push(message.sender)
    })

    return selected
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
    if ( this.props.messageConversation && this.props.messageConversation.id != nextProps.messageConversation.id ) {
      this.props.setSelected( !nextProps.messageConversation ? this.state.selectedList : this.getRecipients( nextProps ) )
    }
  }

  onSuggestionClick = (chip) => {
    if (this.props.updateMessageConversation != undefined) {
      this.props.updateMessageConversation( chip )
    } else {
      this.wipeInput();
      this.inputStream.next('');
  
      const doInsert = _.find(this.props.selectedList, { id: chip.id }) == undefined;
  
      doInsert && this.props.setSelected( [...this.props.selectedList, chip] )
    }
  };

  onRemoveChip = (id) => {
    _.remove(this.props.selectedList, { id: id })

    this.props.setSelected( this.props.selectedList )
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
        value={this.props.selectedList}
        fullWidth
        openOnFocus={true}
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
        selectedList: state.recipient.selected,
      };
    },
    dispatch => ({
      searchForRecipients: searchValue => dispatch({ type: actions.RECIPIENT_SEARCH, payload: { searchValue } }),
      setSelected: selectedList => dispatch({ type: actions.SET_SELECTED, payload: { selectedList } }),
    }),
  ),
  pure,
)(SuggestionField);