import React from 'react';

import i18n from 'd2-i18n';

import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader/Subheader';

import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui-icons/Clear';
import Download from 'material-ui-icons/CloudDownload';

import theme from '../styles/theme';

const styles = {
    attachments(style) {
        return {
            paddingLeft: '8px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: '15px',
            ...style,
        };
    },
    attachment: {
        height: '40px',
        marginRight: '5px',
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
    },
    subheader_size: {
        gridArea: '2 / 1 / span 1 / span 8',
        textAlign: 'left',
        fontSize: '12px',
        lineHeight: '16px',
        padding: '0px',
    },
    progress: {
        gridArea: '2 / 1 / span 1 / span 10',
        bottom: '-35px',
    },
};

const Attachments = ({
    dataDirection,
    attachments,
    style,
    removeAttachment,
    downloadAttachment,
}) => (
    <div style={styles.attachments(style)}>
        {attachments.map(attachment => (
            <Attachment
                key={attachment.name}
                dataDirection={dataDirection}
                attachment={attachment}
                removeAttachment={removeAttachment}
                downloadAttachment={downloadAttachment}
            />
        ))}
    </div>
);

const Attachment = ({ dataDirection, attachment, removeAttachment, downloadAttachment }) => {
    return (
        <FlatButton
            style={styles.attachment}
            backgroundColor={theme.palette.accent2Color}
            label={`${attachment.name} (${parseFloat(parseInt(attachment.size) / 1000000).toFixed(
                2,
            )} MB)`}
            labelPosition="after"
            onClick={() => {
                dataDirection === 'download'
                    ? downloadAttachment(attachment)
                    : removeAttachment(attachment);
            }}
            icon={dataDirection === 'download' ? <Download /> : <Clear />}
        >
            {attachment.loading && <LinearProgress style={styles.progress} mode="indeterminate" />}
        </FlatButton>
    );
};

export default Attachments;
