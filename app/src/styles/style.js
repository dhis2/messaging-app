import theme from '../styles/theme';

export const cardStyles = {
  container: {
    gridColumn: '3',
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
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

export const grid = {
  display: 'grid',
  gridTemplateColumns: '15% 20% 65%',
  paddingTop: '46px',
  width: '100vw',
  height: 'calc(100vh - 46px)',
  position: 'fixed',
  backgroundColor: theme.palette.accent2Color,
};