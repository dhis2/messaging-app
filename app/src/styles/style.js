import theme from '../styles/theme';

export const subheader = {
  color: theme.palette.accent4Color,
  fontSize: '20px',
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
  gridTemplateRows: '48px 100%',
  marginTop: '55px',
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

export const headerPositions = {
  first: {
    marginTop: '5px',
    marginRight: '5px'
  }
}