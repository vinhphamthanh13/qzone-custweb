import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Content = (props) => {
  const { className, content } = props;
  return (
    <Grid item xs={4} className={className}>
      <Typography>
        {content}
      </Typography>
      <Button>we take care it</Button>
    </Grid>
  );
};

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.node.isRequired,
};

Content.defaultProps = {
  className: '',
};

export default Content;
