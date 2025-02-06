import i18n from '@dhis2/d2-i18n'
import propTypes from 'prop-types'
import React from 'react'
import DialogWithReduxState from './DialogWithReduxState.jsx'
import SuggestionField from './SuggestionField.jsx'

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
            onSuggestionClick={(chip) => {
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
