import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { fade } from 'material-ui/utils/colorManipulator';
import {
    blue500,
    blue900,
    pinkA200,
    grey100,
    grey200,
    grey300,
    grey500,
    white,
    darkBlack,
    fullBlack,
} from 'material-ui/styles/colors';

export const colors = {
    primary: '#FC4482',
    primaryDark: '#1976D2',
    accent: '#2E86C1',
    accentLight: '#3993d0',
    accentLighter: '#4d9ed5',
    region: '#FC4482',

    wetasphalt: "34495e",
    midnightblue: "2c3e50",

    dark: '#444444',
    gray: '#CCCCCC',
    grayLight: '#DDDDDD',
    grayLighter: '#EEEEEE',
    warning: 'red',
}

export const fonts = {
    small: 11,
    medium: 13,
    large: 14,
}

export default getMuiTheme({
    palette: {
        primary1Color: 'rgb(39, 102, 150)',
        primary2Color: blue900,
        primary3Color: grey200,
        accent1Color: pinkA200,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: blue500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
});