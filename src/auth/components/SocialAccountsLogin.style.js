const style = theme => ({
  wrapper: {
    margin: `${theme.spacing.unit * 2}px auto`,
  },

  button: {
    margin: theme.spacing.unit * 2,
    '&:hover': {
      animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
    },
  },

  icon: {
    fontSize: `${theme.spacing.unit * 4}px !important}`,
  },
});

export default style;
