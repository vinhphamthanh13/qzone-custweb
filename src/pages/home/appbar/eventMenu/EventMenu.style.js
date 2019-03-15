import { galleryColor, whiteColor } from 'components/material-dashboard-pro-react';

const style = () => ({
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 'auto',
    transition: 'all 0.2s ease',
    borderBottom: '2px solid rgba(235, 234, 234, 0.5)',
    '&:hover': {
      background: `linear-gradient(to right, ${galleryColor}, ${whiteColor})`,
    },
  },
  itemTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
  },
  content: {
  },
});

export default style;
