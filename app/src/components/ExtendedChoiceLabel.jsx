import React from 'react';

import Subheader from 'material-ui/Subheader/Subheader';

const styles = {
    subheaderTitle: { height: '32px', color: 'black' },
    subheader(color, fontWeight) {
        return {
            height: '32px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color,
            fontWeight,
        };
    },
};

const ExtendedChoiceLabel = ({ showTitle, gridArea, title, label, color, fontWeight }) => {
    const displayLabel =
        label && label !== 'NONE'
            ? title === 'Assignee'
                ? label
                : `${label.charAt(0)}${label.toLowerCase().substr(1, label.length)}`
            : '-';

    return (
        <div style={{ gridArea }}>
            {showTitle && <Subheader style={styles.subheaderTitle}> {title} </Subheader>}
            <Subheader style={styles.subheader(color, fontWeight)}>{displayLabel}</Subheader>
        </div>
    );
};

export default ExtendedChoiceLabel;
