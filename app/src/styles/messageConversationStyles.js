import theme from '../styles/theme';
import { fontFamily } from '../constants/development';

export const styles = {
    canvas(gridArea) {
        return {
            gridArea,
            overflowY: 'scroll',
            overflowX: 'hidden',
            height: 'calc(100vh - 110px)',
            paddingTop: '10px',
        };
    },
    innerCanvas: {
        display: 'grid',
        margin: '0px 10px 0px 10px',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridAutoFlow: 'column',
        gridTemplateRows: '50% 30% 20%',
    },
    iconButton: {
        display: 'flex',
        alignSelf: 'center',
        gridArea: '1 / 1',
    },
    subjectSubheader: {
        display: 'flex',
        alignSelf: 'center',
        gridArea: '1 / 1 / span 1 / span 7',
        width: 'calc(100% - 50px)',
        marginLeft: '50px',
        fontSize: '20px',
        fontFamily,
    },
    participantsCanvas: {
        gridArea: '2 / 1 / span 1 / span 7',
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
    participantsSuggestionField(wideview) {
        return {
            gridArea: wideview ? '3 / 1 / span 1 / span 3' : '3 / 1 / span 1 / span 5',
            paddingLeft: '12px',
            marginBottom: '0px',
        };
    },
    participantsAdd(wideview) {
        return {
            gridArea: wideview ? '3 / 4 / span 1 / span 2' : '3 / 6 / span 1 / span 2',
            alignSelf: 'end',
            marginBottom: '28px',
            paddingLeft: '12px',
        };
    },
    messagesCanvas: {
        marginBottom: '50px',
        display: 'grid',
        backgroundColor: theme.palette.accent2Color,
        gridTemplateColumns: '90% 10%',
        gridTemplateRows: '90% 10%',
        margin: '0px 10px 10px 10px',
    },
    messagesInnerCanvas: {
        gridArea: '1 / 1 / span 1 / span 2',
        padding: '0px',
    },
};

export default styles;
