import React from 'react';

import SelectField from 'material-ui/SelectField';

const CustomDropDown = ({ gridColumn, floatingLabelText, onChange, value, children }) => (
    <SelectField
        style={{
            gridArea: `1 / ${gridColumn} / span 2 / span 1`,
            height: '100%',
        }}
        fullWidth
        floatingLabelText={floatingLabelText}
        onChange={onChange}
        value={value}
    >
        {children.map(child => child)}
    </SelectField>
);

export default CustomDropDown;
