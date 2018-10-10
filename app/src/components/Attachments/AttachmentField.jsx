import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import AttachFile from 'material-ui-icons/AttachFile';

import i18n from 'd2-i18n';

const AttachmentField = ({ addAttachment }) => (
    <FlatButton
        className={'attachment__upload-button'}
        label={i18n.t('Upload attachment')}
        labelPosition="after"
        containerElement="label"
        icon={<AttachFile />}
    >
        <input
            className={'attachment__upload-button--input'}
            type="file"
            onChange={() => this.input.files[0] !== undefined && addAttachment(this.input.files[0])}
            ref={x => (this.input = x)}
        />
    </FlatButton>
);

export default AttachmentField;
