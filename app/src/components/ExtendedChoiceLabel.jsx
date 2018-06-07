import React, { Component } from 'react';

import Subheader from 'material-ui/Subheader/Subheader';

const ExtendedChoiceLabel = ({ showTitle, gridArea, title, label, color, fontWeight }) => {
    return (
        <div style={{ gridArea: gridArea }}>
            {showTitle && (
                <Subheader style={{ height: '32px', color: 'black' }}> {title} </Subheader>
            )}
            <Subheader
                style={{
                    height: '32px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: color,
                    fontWeight,
                }}
            >
                {label && label !== 'NONE' ? label : '-'}
            </Subheader>
        </div>
    );
};

export default ExtendedChoiceLabel;
