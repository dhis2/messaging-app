import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import AttachFile from 'material-ui-icons/AttachFile';

import i18n from 'd2-i18n';

const styles = {
    uploadButton: {
        verticalAlign: 'middle',
    },
    uploadInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
    },
};

const AttachmentField = ({ addAttachment }) => (
    <FlatButton
        label={i18n.t('Upload attachment')}
        labelPosition="after"
        style={styles.uploadButton}
        containerElement="label"
        icon={<AttachFile />}
    >
        <input
            type="file"
            onChange={() => this.input.files[0] !== undefined && addAttachment(this.input.files[0])}
            ref={x => (this.input = x)}
            style={styles.uploadInput}
        />
    </FlatButton>
);

export default AttachmentField;
