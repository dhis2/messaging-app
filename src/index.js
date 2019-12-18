import React from 'react'
import { render } from 'react-dom'
import * as serviceWorker from './serviceWorker'
import App from './components/App/App'
import { init, getUserSettings } from 'd2/lib/d2'
import { CssReset } from '@dhis2/ui-core'
import { Provider } from '@dhis2/app-runtime'

import configI18n from './utils/configI18n'
import { supportsUnversionedApiCalls } from './utils/helpers'

import './index.css'
import 'typeface-roboto'

const { REACT_APP_DHIS2_BASE_URL } = process.env

const initApp = async () => {
    const dhisConfig = {
        baseUrl: `${REACT_APP_DHIS2_BASE_URL}/api/`,
        headers: null,
        schemas: ['messageConversation'],
    }
    const d2 = await init(dhisConfig)
    const userSettings = await getUserSettings()

    const systemVersion = d2.system.version.minor
    const providerApiVersion = supportsUnversionedApiCalls(systemVersion)
        ? ''
        : systemVersion

    configI18n(userSettings)

    render(
        <Provider
            config={{
                baseUrl: REACT_APP_DHIS2_BASE_URL,
                apiVersion: providerApiVersion,
            }}
        >
            <CssReset />
            <App d2={d2} />
        </Provider>,
        document.getElementById('root')
    )
}

initApp()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
