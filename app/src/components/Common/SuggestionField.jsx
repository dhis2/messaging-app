import React, { Component } from 'react'

import { Subject, Observable } from 'rxjs/Rx'
import ChipInput from 'material-ui-chip-input'

import i18n from '@dhis2/d2-i18n'
import * as api from 'api/api'

const find = require('lodash/find')
const remove = require('lodash/remove')

const searchDelay = 300

const minCharLength = 2

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
            searchOnlyUsers: this.props.searchOnlyUsers,
            searchOnlyFeedbackRecipients: this.props
                .searchOnlyFeedbackRecipients,
            lastSearch: '',
            errorText: undefined,
        }
    }

    inputStream = new Subject()
    componentDidMount = () => {
        this.inputStream
            .debounce(() => Observable.timer(searchDelay))
            .subscribe(input => {
                const doSearch =
                    find(this.state.searchResult, { displayName: input }) ===
                        undefined &&
                    input !== '' &&
                    input.length >= minCharLength

                if (doSearch) {
                    api.searchRecipients(
                        input,
                        this.state.searchOnlyUsers,
                        this.state.searchOnlyFeedbackRecipients,
                        this.props.feedbackRecipientsId
                    ).then(({ users, userGroups, organisationUnits }) => {
                        const addType = type => result => ({ ...result, type })

                        let internalSearchResult = users.map(addType('user'))

                        if (!this.state.searchOnlyUsers) {
                            internalSearchResult = internalSearchResult
                                .concat(userGroups.map(addType('userGroup')))
                                .concat(
                                    organisationUnits.map(
                                        addType('organisationUnit')
                                    )
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
            })
    }

    onSuggestionClick = chip => {
        if (this.props.onSuggestionClick !== undefined) {
            this.props.onSuggestionClick(chip)
        } else {
            this.wipeInput()
            this.inputStream.next('')

            const doInsert =
                find(this.props.recipients, { id: chip.id }) === undefined

            doInsert &&
                this.props.updateRecipients([
                    ...this.props.recipients,
                    find(this.state.searchResult, { id: chip.id }),
                ])
        }
    }

    onRemoveChip = id => {
        remove(this.props.recipients, { id })
        this.props.updateRecipients(this.props.recipients)
    }

    wipeInput = () => {
        this.setState({
            input: '',
            searchResult: [],
        })
    }

    updateInput = input => {
        this.inputStream.next(input)
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
