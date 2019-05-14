import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import LinearProgress from 'material-ui/LinearProgress'
import Clear from 'material-ui-icons/Clear'
import Download from 'material-ui-icons/CloudDownload'
import theme from '../../styles/theme'

const styles = {
    attachment__button: {
        height: '40px',
        marginRight: '5px',
        marginBottom: '5px',
        display: 'flex',
    },
}

const Attachments = ({
    dataDirection,
    attachments,
    style,
    removeAttachment,
    downloadAttachment,
    cancelAttachment,
}) => (
    <div className={'attachment'} style={{ ...style }}>
        {attachments.map((attachment, index) => (
            <Attachment
                // combining name with index prevents errors when user uploads files with duplicate names
                key={`${attachment.name}-${index}`}
                dataDirection={dataDirection}
                attachment={attachment}
                removeAttachment={removeAttachment}
                downloadAttachment={downloadAttachment}
                cancelAttachment={cancelAttachment}
            />
        ))}
    </div>
)

const Attachment = ({
    dataDirection,
    attachment,
    removeAttachment,
    downloadAttachment,
    cancelAttachment,
}) => {
    return (
        <FlatButton
            style={styles.attachment__button}
            backgroundColor={theme.palette.accent2Color}
            label={`${attachment.name} (${parseFloat(
                parseInt(attachment.contentLength, 10) / 1000000
            ).toFixed(2)} MB)`}
            labelPosition="after"
            onClick={() => {
                dataDirection === 'download'
                    ? downloadAttachment(attachment)
                    : attachment.loading
                        ? cancelAttachment(attachment.name)
                        : removeAttachment(attachment)
            }}
            icon={dataDirection === 'download' ? <Download /> : <Clear />}
        >
            {attachment.loading && (
                <LinearProgress
                    className={'attachment__progress'}
                    mode="indeterminate"
                />
            )}
        </FlatButton>
    )
}

export default Attachments
