import React from 'react'

import Subheader from 'material-ui/Subheader/Subheader'

const styles = {
    subheaderTitle: {
        height: '32px',
        color: 'black',
        paddingLeft: 0,
        paddingRight: 16,
    },
    subheader(color, fontWeight) {
        return {
            height: '32px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: 0,
            color,
            fontWeight,
        }
    },
}

const ExtendedChoiceLabel = ({
    showTitle,
    title,
    label,
    color,
    fontWeight,
}) => {
    const displayLabel =
        label && label !== 'NONE'
            ? title === 'Assignee'
                ? label
                : `${label.charAt(0)}${label
                      .toLowerCase()
                      .substr(1, label.length)}`
            : '-'

    return (
        <div style={{ flex: 2, paddingLeft: 10, maxWidth: 200 }}>
            {showTitle && (
                <Subheader style={styles.subheaderTitle}> {title} </Subheader>
            )}
            <Subheader style={styles.subheader(color, fontWeight)}>
                {displayLabel}
            </Subheader>
        </div>
    )
}

export default ExtendedChoiceLabel
