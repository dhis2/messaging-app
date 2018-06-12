import React from 'react';

import Subheader from 'material-ui/Subheader/Subheader';
import i18n from 'd2-i18n';

const ExtendedChoiceLabel = ({ showTitle, gridArea, title, label, color, fontWeight }) => {
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
                {label && label !== i18n.t('NONE') ? label : '-'}
            </Subheader>
        </div>
    );
};

export default ExtendedChoiceLabel;
