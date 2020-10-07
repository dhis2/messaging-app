import React from 'react'
import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CircularProgress } from 'material-ui'
import { Provider } from 'react-redux'

import App from './App'
import store from '../../store'
import { setEngine } from '../../api/api'
import AddD2Context from './AddD2Context'

import '../../index.css'
import 'typeface-roboto'

const AppWrapper = () => {
    const { baseUrl } = useConfig()
    const engine = useDataEngine()
    const { d2 } = useD2({
        d2Config: {
            schemas: ['messageConversation'],
            // This app prefers doing unversioned API calls
            baseUrl: `${baseUrl}/api`,
        },
    })

    if (!d2) {
        return (
            <AddD2Context>
                <div className="page-loader-wrap">
                    <CircularProgress size={48} />
                </div>
            </AddD2Context>
        )
    }

    // This makes the engine instance available in the api module
    setEngine(engine)

    return (
        <Provider store={store}>
            <AddD2Context d2={d2}>
                <App />
            </AddD2Context>
        </Provider>
    )
}

export default AppWrapper
