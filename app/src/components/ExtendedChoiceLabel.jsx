import React from 'react';

import Subheader from 'material-ui/Subheader/Subheader';

const ExtendedChoiceLabel = ({ showTitle, gridArea, title, label, color, fontWeight }) => {
    const displayLabel =
        label && label !== 'NONE'
            ? title === 'Assignee'
                ? label
                : `${label.charAt(0)}${label.toLowerCase().substr(1, label.length)}`
            : '-';

    return (
        <div style={{ gridArea }}>
            {showTitle && (
                <Subheader style={{ height: '32px', color: 'black' }}> {title} </Subheader>
            )}
            <Subheader
                style={{
                    height: '32px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color,
                    fontWeight,
                }}
            >
                {displayLabel}
            </Subheader>
        </div>
    );
};

export default ExtendedChoiceLabel;
