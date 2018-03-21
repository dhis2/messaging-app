import theme from '../styles/theme';

export const cardStyles = {
  subheader: {
    color: theme.palette.accent4Color,
    fontSize: '20px',
  }
};

export const messagePanelContainer = {
  overflowY: 'scroll',
  overflowX: 'hidden',
};

export const messagePanelListContainer = {
  gridArea: '2 / 2 / span 1 / span 2',
  overflowY: 'scroll',
  overflowX: 'hidden',
};

export const grid = {
  display: 'grid',
  gridTemplateColumns: '15% 20% 65%',
  gridTemplateRows: '48px 100%',
  paddingTop: '46px',
  width: '100vw',
  height: 'calc(100vh - 46px)',
  position: 'fixed',
  backgroundColor: theme.palette.accent2Color,
};

export const tabsStyles = {
  tabItem: {
    color: theme.palette.textColor,
    backgroundColor: theme.palette.accent2Color,
  }
}