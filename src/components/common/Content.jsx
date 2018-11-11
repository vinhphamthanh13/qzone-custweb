import React from 'react';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    width: '100%',
    margin: '1em',
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
      width: '70%',
      margin: '0',
    },
  },
  subTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    width: '90%',
  },
  paragraph: {
    paddingBottom: '2em',
  },
  button: {
    borderRadius: '3em',
  },
});

const Content = (props) => {
  const {
    classes, title, subTitle, content, buttonLabel, buttonClass, contentClass,
  } = props;
  const pageTitle = title
    ? <Typography className={classes.title}>{Parser(title)}</Typography>
    : '';
  const pageContent = content
    ? <Typography gutterBottom className={classes.paragraph}>{content}</Typography>
    : '';
  const pageSubtitle = subTitle
    ? (
      <Typography
        gutterBottom
        className={classes.subTitle}
      >
        {Parser(subTitle)}
      </Typography>)
    : '';
  return (
    <Grid item xs={12} md={4} className={contentClass}>
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
  title: PropTypes.string,
  subTitle: PropTypes.string,
  content: PropTypes.string,
  buttonClass: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  contentClass: PropTypes.string,
};

Content.defaultProps = {
  title: '',
  subTitle: '',
  content: '',
  buttonClass: '',
  contentClass: '',
};

export default withStyles(styles)(Content);
