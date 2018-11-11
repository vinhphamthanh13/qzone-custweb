import React from 'react';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Content = (props) => {
  const {
    title, titleClass, subTitle, subTitleClass, content, contentClass, buttonLabel, buttonClass,
  } = props;
  const pageTitle = title
    ? <Typography classes={titleClass}>{Parser(title)}</Typography>
    : '';
  const pageSubtitle = subTitle
    ? <Typography gutterBottom classes={subTitleClass}>{Parser(subTitle)}</Typography>
    : '';
  const pageContent = content
    ? <Typography gutterBottom classes={contentClass}>{Parser(content)}</Typography>
    : '';
  return (
    <Grid item xs={12} md={4}>
      {pageTitle}
      {pageSubtitle}
      {pageContent}
      <Button variant="contained" classes={buttonClass}>{buttonLabel}</Button>
    </Grid>
  );
};

Content.propTypes = {
  title: PropTypes.string,
  titleClass: PropTypes.string,
  subTitle: PropTypes.string,
  subTitleClass: PropTypes.string,
  content: PropTypes.string,
  contentClass: PropTypes.string,
  buttonClass: PropTypes.objectOf(PropTypes.string),
  buttonLabel: PropTypes.string.isRequired,
};

Content.defaultProps = {
  title: '',
  titleClass: '',
  subTitle: '',
  subTitleClass: '',
  content: '',
  contentClass: '',
  buttonClass: { root: '' },
};

export default Content;
