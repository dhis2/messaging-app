import theme from '../styles/theme';

export const cardStyles = {
  cardItem: {
    marginLeft: '15px',
    marginRight: '15px',
  },
  replyItem: {
    marginLeft: '15px',
    marginRight: '15px',
    marginBottom: '50px',
  },
  subheader: {
    color: theme.palette.textColor,
    marginLeft: '15px',
    fontSize: '20px',
  }
};

export const messagePanelContainer = {
  overflowY: 'scroll',
  overflowX: 'hidden',
};

export const messagePanelListContainer = {
  gridArea: '2 / 2 / span 1 / span 2',
  borderLeftStyle: 'solid',
  borderLeftColor: theme.palette.accent4Color,
  borderLeftWidth: '0.5px',
  marginRight: '15px',
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