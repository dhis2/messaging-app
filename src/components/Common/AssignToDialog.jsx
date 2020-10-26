import React from 'react'
import propTypes from '@dhis2/prop-types'
import i18n from '@dhis2/d2-i18n'
import SuggestionField from './SuggestionField'
import DialogWithReduxState from './DialogWithReduxState'

const AssignToDialog = ({
    open,
    onRequestClose,
    updateMessageConversations,
    messageType,
    feedbackRecipientsId,
}) => (
    <DialogWithReduxState
        open={open}
        onRequestClose={() => {
            onRequestClose()
        }}
    >
        <SuggestionField
            onSuggestionClick={chip => {
                updateMessageConversations([chip.id])
                onRequestClose()
            }}
            searchOnlyUsers
            searchOnlyFeedbackRecipients={messageType.id === 'TICKET'}
            feedbackRecipientsId={feedbackRecipientsId}
            recipients={[]}
            key={'suggestionField'}
            label={i18n.t('Assignee')}
        />
    </DialogWithReduxState>
)

AssignToDialog.propTypes = {
    feedbackRecipientsId: propTypes.string,
    messageType: propTypes.shape({ id: propTypes.string }),
    open: propTypes.bool,
    updateMessageConversations: propTypes.func,
    onRequestClose: propTypes.func,
}

export default AssignToDialog
