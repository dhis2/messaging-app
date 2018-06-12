import React from 'react';

import Dialog from 'material-ui/Dialog';
import i18n from 'd2-i18n';

import SuggestionField from './SuggestionField';

const AssignToDialog = ({ open, onRequestClose, updateMessageConversations }) => (
    <Dialog
        open={open}
        onRequestClose={() => {
            onRequestClose();
        }}
    >
        <SuggestionField
            onSuggestionClick={chip => {
                updateMessageConversations([chip.id]);
                onRequestClose();
            }}
            searchOnlyUsers
            recipients={[]}
            key={'suggestionField'}
            label={i18n.t('Assignee')}
        />
    </Dialog>
);

export default AssignToDialog;
