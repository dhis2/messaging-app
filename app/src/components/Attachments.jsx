import React from 'react';

import Subheader from 'material-ui/Subheader/Subheader';

import CircularProgress from 'material-ui/CircularProgress';

const styles = {
    attachments: {
        paddingLeft: '8px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    attachment: {
        height: '40px',
        width: '200px',
        padding: '5px',
        marginRight: '5px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#c8c8c8',
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
    },
    subheader_filename: {
        gridArea: '1 / 1 / span 1 / span 8',
        fontSize: '14px',
        lineHeight: '20px',
        padding: '0px',
        color: 'black',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    subheader_size: {
        gridArea: '2 / 1 / span 1 / span 8',
        fontSize: '12px',
        lineHeight: '16px',
        padding: '0px',
    },
    rightIcon: {
        gridArea: '1 / 9 / span 2 / span 2',
    },
};

const Attachments = ({ attachments }) => (
    <div style={styles.attachments}>
        {attachments.map(attachment => <Attachment attachment={attachment} />)}
    </div>
);

const Attachment = ({ attachment }) => {
    return (
        <div key={attachment.name} style={styles.attachment}>
            <Subheader style={styles.subheader_filename}> {attachment.name} </Subheader>
            <Subheader style={styles.subheader_size}>{`${parseFloat(
                parseInt(attachment.size) / 1000000,
            ).toFixed(2)} MB`}</Subheader>
            {attachment.loading && <CircularProgress style={styles.rightIcon} />}
        </div>
    );
};

export default Attachments;
