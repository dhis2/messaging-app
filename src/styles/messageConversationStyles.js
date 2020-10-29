import theme from '../styles/theme.js'
import { fontFamily } from '../constants/development.js'

export const styles = {
    canvas: {
        flex: '3 0',
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: 'calc(100vh - 110px)',
        paddingTop: '10px',
    },
    innerCanvas: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0px 10px 0px 10px',
    },
    header: {
        display: 'flex',
    },
    iconButton: {
        display: 'flex',
        alignSelf: 'center',
    },
    subjectSubheader: {
        display: 'flex',
        alignSelf: 'center',
        fontSize: '20px',
        fontFamily,
    },
    participantsCanvas: {
        display: 'flex',
        flexDirection: 'column',
    },
    participants: {
        paddingLeft: '12px',
        paddingTop: '10px',
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        height: '32px',
        marginRight: '3px',
        marginBottom: '3px',
    },
    participantAddRow: {
        display: 'flex',
    },
    participantsSuggestionField: {
        paddingLeft: '12px',
        marginBottom: '0px',
        flex: 1,
    },
    participantsAdd: {
        alignSelf: 'flex-end',
        marginBottom: '28px',
        paddingLeft: '12px',
    },
    messagesCanvas: {
        marginBottom: '50px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.accent2Color,
        margin: '0px 10px 10px 10px',
    },
    messagesInnerCanvas: {
        padding: '0px',
    },
}

export default styles
