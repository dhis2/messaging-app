import { useDataEngine } from '@dhis2/app-runtime'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React from 'react'
import { Provider } from 'react-redux'
import { setEngine } from '../../api/api.js'
import store from '../../store.js'
import theme from '../../styles/theme.js'
import App from './App.jsx'

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
