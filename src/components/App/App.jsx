import React from 'react'
import { CssReset } from '@dhis2/ui-core'

import CustomSnackBar from '../Common/CustomSnackBar'
import Routes from './Routes'

const App = () => (
    <div>
        <CssReset />
        <CustomSnackBar />
        <Routes />
    </div>
)

export default App
