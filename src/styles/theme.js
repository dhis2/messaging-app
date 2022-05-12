import {
    blue50,
    blue100,
    blue300,
    blue500,
    pinkA200,
    grey50,
    grey100,
    grey300,
    grey500,
    grey700,
    grey900,
    orange500,
    white,
    darkBlack,
    fullBlack,
} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { fade } from 'material-ui/utils/colorManipulator'

export default getMuiTheme({
    palette: {
        negative: pinkA200,
        blue50,
        primary1Color: '#1D8BF1',
        primary2Color: blue100,
        primary3Color: blue300,
        primary4Color: blue500,
        accent1Color: grey50,
        accent2Color: grey100,
        accent3Color: grey300,
        accent4Color: grey500,
        followUp: orange500,
        darkGray: grey700,
        superDarkGray: grey900,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
})
