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
    margin: '0.3em',
    height: 'auto',
    background: 'rgba(0,0,0,0.2)',
    boxShadow: '2px 2px 3px rgba(110, 110, 110, 0.9)',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

const ImageGridList = (props) => {
  const { classes, pixList, square } = props;
  const [imageGrid, breakPoint] = pixList.length > 1
    ? [(
      <GridList cols={square} classes={classes}>
        {pixList.map(image => (
          <GridListTile classes={classes}>
            <img className={classes.image} src={image.src} alt={image.name} />
          </GridListTile>
        ))}
      </GridList>), 4]
    : [<img className={classes.image} src={pixList[0].src} alt={pixList[0].name} />, 6];
  return (
    <Grid item xs={breakPoint}>
      {imageGrid}
    </Grid>
  );
};

ImageGridList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
  pixList: PropTypes.arrayOf(PropTypes.object).isRequired,
  square: PropTypes.number.isRequired,
};

export default withStyles(styles)(ImageGridList);
