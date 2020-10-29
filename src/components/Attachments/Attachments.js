import React from 'react'
import propTypes from '@dhis2/prop-types'
import FlatButton from 'material-ui/FlatButton'
import LinearProgress from 'material-ui/LinearProgress'
import Clear from 'material-ui-icons/Clear'
import Download from 'material-ui-icons/CloudDownload'
import theme from '../../styles/theme.js'
import './Attachments.css'

const Attachments = ({
    dataDirection,
    attachments,
    style,
    removeAttachment,
    downloadAttachment,
    cancelAttachment,
}) => (
    <div className="attachment" style={{ ...style }}>
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

Attachments.propTypes = {
    attachments: propTypes.array,
    cancelAttachment: propTypes.func,
    dataDirection: propTypes.string,
    downloadAttachment: propTypes.func,
    removeAttachment: propTypes.func,
    style: propTypes.object,
}

const Attachment = ({
    dataDirection,
    attachment,
    removeAttachment,
    downloadAttachment,
    cancelAttachment,
}) => {
    return (
        <FlatButton
            className="attachment__button"
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

Attachment.propTypes = {
    attachment: propTypes.object,
    cancelAttachment: propTypes.func,
    dataDirection: propTypes.string,
    downloadAttachment: propTypes.func,
    removeAttachment: propTypes.func,
}

export default Attachments
