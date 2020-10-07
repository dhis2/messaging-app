import React from 'react'
import { useConfig } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CircularProgress } from 'material-ui'
import { Provider } from 'react-redux'

import App from './App'
import store from '../../store'
import AddD2Context from './AddD2Context'

import '../../index.css'
import 'typeface-roboto'

const AppWrapper = () => {
    const { baseUrl } = useConfig()
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

    return (
        <Provider store={store}>
            <AddD2Context d2={d2}>
                <App />
            </AddD2Context>
        </Provider>
    )
}

export default AppWrapper
