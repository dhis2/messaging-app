import React from 'react'
import propTypes from '@dhis2/prop-types'
import { Provider, ReactReduxContext } from 'react-redux'
import Dialog from 'material-ui/Dialog'

export default function DialogWithReduxState(props) {
    return (
        <ReactReduxContext.Consumer>
            {ctx => (
                <Dialog {...props}>
                    <Provider store={ctx.store}>{props.children}</Provider>
                </Dialog>
            )}
        </ReactReduxContext.Consumer>
    )
}

DialogWithReduxState.propTypes = {
    children: propTypes.node,
}
