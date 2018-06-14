import theme from '../styles/theme';

export const subheader = {
    fontSize: '20px',
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
    gridTemplateColumns: 'repeat(10, 1fr)',
    gridTemplateRows: '48px calc(100vh - 48px)',
    marginTop: '48px',
    width: '100%',
    height: 'calc(100vh - 55px)',
    position: 'fixed',
};
