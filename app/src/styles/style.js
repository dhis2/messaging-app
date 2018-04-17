import theme from '../styles/theme';

export const subheader = {
  color: theme.palette.accent4Color,
  fontSize: '20px',
  gridArea: '1 / 1'
};

export const subheader_minilist = {
  fontSize: '14px',
  paddingLeft: '50px',
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  display: 'flex',
  alignSelf: 'center',
  gridArea: '1 / 1'
};

export const messagePanelContainer = {
  overflowY: 'scroll',
  overflowX: 'hidden',
  borderRightStyle: 'solid',
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

export const tabsStyles = {
  tabItem: {
    color: theme.palette.textColor,
    backgroundColor: theme.palette.accent2Color,
    paddingBottom: '10px',
  }
}