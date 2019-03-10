import { galleryColor, whiteColor } from 'components/material-dashboard-pro-react';

const style = () => ({
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 'auto',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: `linear-gradient(to right, ${galleryColor}, ${whiteColor})`,
    },
  },
  title: {
  },
  content: {
  },
});

export default style;
