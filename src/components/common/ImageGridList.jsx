import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  tile: {
    margin: '0.1em',
    textAlign: 'center',
    background: 'rgba(0,0,0,0.3)',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

const ImageGridList = (props) => {
  const { classes, pixList } = props;

  return (
    <Grid item xs={4}>
      <GridList cols={2} classes={classes}>
        {pixList.map(image => (
          <GridListTile classes={classes}>
            <img className={classes.image} src={image.src} alt={image.name} />
          </GridListTile>
        ))}
      </GridList>
    </Grid>
  );
};

ImageGridList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
  pixList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(ImageGridList);
