import theme from '../styles/theme';
import { fontFamily } from '../constants/development'

export const subheader = {
  fontSize: '20px',
  gridArea: '1 / 1',
  fontFamily: fontFamily,
};

export const subheader_minilist = {
  fontSize: '14px',
  paddingLeft: '50px',
  fontFamily: fontFamily,
  display: 'flex',
  alignSelf: 'center',
  gridArea: '1 / 1'
};

export const messagePanelContainer = {
  overflowY: 'scroll',
  overflowX: 'hidden',
  borderRightWidth: '1px',
  borderRightColor: theme.palette.accent4Color,
  height: 'calc(100vh - 100px)',
};

export const grid = {
  display: 'grid',
  gridTemplateColumns: 'minmax(150px, 15%) 20% 65%',
  gridTemplateRows: '48px calc(100vh - 48px)',
  marginTop: '48px',
  width: '100%',
  height: 'calc(100vh - 55px)',
  position: 'fixed'
};