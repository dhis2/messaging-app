import i18n from '@dhis2/d2-i18n'
import propTypes from '@dhis2/prop-types'
import AttachFile from 'material-ui-icons/AttachFile'
import FlatButton from 'material-ui/FlatButton'
import React from 'react'
import './AttachmentUploadButton.css'

const createHandleChange = (addAttachment) => (event) => {
    const files = event.target.files
    const hasFile = files.length > 0

    if (hasFile) {
        addAttachment(files[0])
    }
}

const AttachmentUploadButton = ({ addAttachment }) => (
    <FlatButton
        className="attachment__upload-button"
        label={i18n.t('Upload attachment')}
        labelPosition="after"
        containerElement="label"
        icon={<AttachFile />}
    >
        <input
            className="attachment__upload-button--input"
            type="file"
            onChange={createHandleChange(addAttachment)}
        />
    </FlatButton>
)

AttachmentUploadButton.propTypes = {
    addAttachment: propTypes.func,
}

export default AttachmentUploadButton
