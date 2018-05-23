import React, { Component } from 'react';

import Subheader from 'material-ui/Subheader/Subheader';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const CustomDropDown = ({
    subheader,
    gridColumn,
    floatingLabelText,
    onChange,
    value,
    children,
}) => (
    <SelectField
        style={{
            gridArea: '1 / ' + gridColumn + ' / span 2 / span 1',
            height: '100%',
        }}
        fullWidth
        floatingLabelText={floatingLabelText}
        onChange={onChange}
        value={value}
    >
        {children.map(child => {
            return child;
        })}
    </SelectField>
);

export default CustomDropDown;
