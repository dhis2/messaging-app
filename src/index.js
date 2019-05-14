import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import * as serviceWorker from './serviceWorker';
import Messaging from './components/Messaging/Messaging'
import { init, getUserSettings } from 'd2/lib/d2'
import configI18n from './utils/configI18n'
import getDhis2CoreVersion from './utils/getDhis2CoreVersion'

const schemas = ['messageConversation']
;(async () => {
    const PRODUCTION = process.env.NODE_ENV === 'production'
    const baseUrl = PRODUCTION ? '..' : 'http://localhost:8080'
    const instanceVersion = await getDhis2CoreVersion(baseUrl)
    const dhisConfig = {
        baseUrl: `${baseUrl}/api/${instanceVersion.minor}`,
        headers: PRODUCTION ? null : null,
        schemas,
    }
    const d2 = await init(dhisConfig)
    const userSettings = await getUserSettings()
    configI18n(userSettings)
    render(<Messaging d2={d2} />, document.getElementById('root'))
})()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
