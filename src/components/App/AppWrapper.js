import React from 'react'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { useDataEngine } from '@dhis2/app-runtime'
import theme from '../../styles/theme.js'
import App from './App.js'
import store from '../../store.js'
import { setEngine } from '../../api/api.js'

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
