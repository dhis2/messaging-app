import React from 'react'
import { Provider } from 'react-redux'
import i18n from 'd2-i18n'
import HeaderBar from '@dhis2/ui/widgets/HeaderBar'
import CustomSnackBar from '../Common/CustomSnackBar'
import store from '../../store'
import Routes from './Routes'
import AddD2Context from './AddD2Context'

const App = ({ d2 }) => (
    <Provider store={store}>
        <AddD2Context d2={d2}>
            <div>
                <HeaderBar appName={i18n.t('Messaging')} />
                <CustomSnackBar />
                <Routes />
            </div>
        </AddD2Context>
    </Provider>
)

export default App
