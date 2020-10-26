import React from 'react'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { useDataEngine } from '@dhis2/app-runtime'
import theme from '../../styles/theme'

import App from './App'
import store from '../../store'
import { setEngine } from '../../api/api'

import '../../index.css'
import 'typeface-roboto'

const AppWrapper = () => {
    const engine = useDataEngine()
    setEngine(engine)

    return (
        <Provider store={store}>
            <MuiThemeProvider muiTheme={theme}>
                <App />
            </MuiThemeProvider>
        </Provider>
    )
}

export default AppWrapper
