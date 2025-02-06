import Dialog from 'material-ui/Dialog'
import propTypes from 'prop-types'
import React from 'react'
import { Provider, ReactReduxContext } from 'react-redux'

/*
 * This component is needed because in this version of MUI
 * the redux context is not propagated onto a Portal
 */
export default function DialogWithReduxState(props) {
    return (
        <ReactReduxContext.Consumer>
            {(ctx) => (
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
