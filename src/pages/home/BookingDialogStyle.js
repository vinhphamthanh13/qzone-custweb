const style = (theme) => {
  console.log('theme', theme);
  return ({
    root: {
      width: '100%',
    },
    avatar: {
      maxWidth: theme.spacing.unit * 4,
      maxHeight: theme.spacing.unit * 4,
      background: theme.palette.primary.light,
      margin: theme.spacing.unit * 2,
    },
    diagRoot: {
      padding: '0px !important',
    },
  });
};

export default style;
