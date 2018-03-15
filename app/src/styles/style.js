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
    color: theme.palette.accent3Color,
    marginLeft: '20px',
    fontSize: '20px',
  }
};

export const messagePanelContainer = {
  gridColumn: '3',
  gridRow: '2',
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
  gridTemplateRows: '4% 96%',
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