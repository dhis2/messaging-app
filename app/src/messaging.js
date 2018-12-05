/* global DHIS_CONFIG */
import React from 'react'
import { render } from 'react-dom'

import Messaging from 'components/Messaging/Messaging'

import { init, getUserSettings } from 'd2/lib/d2'
import 'whatwg-fetch'

import configI18n from './utils/configI18n'

const dhisVersion = 30
const schemas = ['messageConversation']
;(async () => {
    const PRODUCTION = process.env.NODE_ENV === 'production'
    const baseUrl = PRODUCTION ? '..' : DHIS_CONFIG.baseUrl
    const dhisConfig = {
        baseUrl: `${baseUrl}/api/${dhisVersion}`,
        headers: PRODUCTION ? null : null,
        schemas,
    }
    const d2 = await init(dhisConfig)
    const userSettings = await getUserSettings()
    configI18n(userSettings)
    render(<Messaging d2={d2} />, document.getElementById('messaging'))
})()
