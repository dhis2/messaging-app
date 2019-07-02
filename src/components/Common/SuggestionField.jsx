import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import { debounce } from '../../utils/helpers'
import i18n from 'd2-i18n'
import * as api from '../../api/api'

const searchDelay = 300
const minCharLength = 2

/*
 * An AutoComplete text field with suggestions from a given list of
 * identifiable objects. Selected objects are shown as chips in the text field.
 */

class SuggestionField extends Component {
    state = {
        input: '',
        searchResult: [],
        searchOnlyUsers: this.props.searchOnlyUsers,
        searchOnlyFeedbackRecipients: this.props.searchOnlyFeedbackRecipients,
        lastSearch: '',
        errorText: undefined,
    }

    debouncedSearch = debounce(this.search.bind(this), searchDelay)

    search(input) {
        const doSearch =
            !this.state.searchResult.find(
                result => result.displayName === input
            ) &&
            input !== '' &&
            input.length >= minCharLength

        if (doSearch) {
            const {
                feedbackRecipientsId,
                searchOnlyUsers,
                searchOnlyFeedbackRecipients,
            } = this.props

            api.searchRecipients({
                searchValue: input,
                searchOnlyUsers,
                searchOnlyFeedbackRecipients,
                feedbackRecipientsId,
            }).then(({ users, userGroups, organisationUnits }) => {
                const addType = type => result => ({ ...result, type })
                let internalSearchResult = users.map(addType('user'))

                if (!this.state.searchOnlyUsers) {
                    internalSearchResult = internalSearchResult
                        .concat(userGroups.map(addType('userGroup')))
                        .concat(
                            organisationUnits.map(addType('organisationUnit'))
                        )
                }

                this.setState({
                    searchResult: internalSearchResult,
                    errorText:
                        internalSearchResult.length === 0
                            ? i18n.t('No results found')
                            : undefined,
                })
            })
        } else {
            this.setState({
                lastSearch: input,
                searchResult:
                    (this.state.lastSearch !== '' && input === '') ||
                    input.length < minCharLength
                        ? []
                        : this.state.searchResult,
                errorText:
                    input !== '' && input.length < minCharLength
                        ? i18n.t(
                              `Please enter at least ${minCharLength} characters`
                          )
                        : this.state.searchWarning,
            })
        }
    }

    onSuggestionClick = chip => {
        if (this.props.onSuggestionClick !== undefined) {
            this.props.onSuggestionClick(chip)
        } else {
            this.wipeInput()
            this.debouncedSearch('')

            const doInsert = !this.props.recipients.find(
                recipient => recipient.id === chip.id
            )

            doInsert &&
                this.props.updateRecipients([
                    ...this.props.recipients,
                    this.state.searchResult.find(
                        result => result.id === chip.id
                    ),
                ])
        }
    }

    onRemoveChip = id => {
        this.props.updateRecipients(
            this.props.recipients.filter(recipient => recipient.id !== id)
        )
    }

    wipeInput = () => {
        this.setState({
            input: '',
            searchResult: [],
        })
    }

    updateInput = input => {
        this.debouncedSearch(input)
        this.setState({
            input,
        })
    }

    render() {
        return (
            <div
                style={{ ...this.props.style, height: this.props.inputHeight }}
            >
                <ChipInput
                    style={{ marginBottom: 16 }}
                    disabled={
                        this.props.disabled === undefined
                            ? false
                            : this.props.disabled
                    }
                    errorText={this.props.errorText || this.state.errorText}
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
            </div>
        )
    }
}

export default SuggestionField
