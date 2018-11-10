import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    width: '80%',
  },
  subTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    width: '90%',
  },
  paragraph: {
    marginLeft: `${theme.spacing.unit * 4}px`,
    marginBottom: `${theme.spacing.unit * 8}px`,
    [theme.breakpoints.up('md')]: {
      marginLeft: `${theme.spacing.unit * 2}px`,
    },
  },
  button: {
    borderRadius: '3em',
  },
});

const Content = (props) => {
  const {
    classes, title, subTitle, content, buttonLabel, buttonClass,
  } = props;
  const pageTitle = title
    ? <Typography gutterBottom className={classes.title}>{title}</Typography>
    : '';
  const pageContent = content
    ? <Typography className="organisation-page__content-block">{content}</Typography>
    : '';
  const pageSubtitle = subTitle
    ? <Typography gutterBottom className={classes.subTitle}>{subTitle}</Typography>
    : '';
  return (
    <Grid item xs={12} md={4} className={classes.paragraph}>
      {pageTitle}
      {pageSubtitle}
      {pageContent}
      <Button
        variant="contained"
        className={classNames(buttonClass, classes.button)}
      >
        {buttonLabel}
      </Button>
    </Grid>
  );
};

Content.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  content: PropTypes.string,
  buttonClass: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
};

Content.defaultProps = {
  subTitle: '',
  content: '',
  buttonClass: '',
};

export default withStyles(styles)(Content);
