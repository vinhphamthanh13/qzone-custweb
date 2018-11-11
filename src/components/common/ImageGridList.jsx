import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';
import Styles from 'components/common/styles';

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
});

const ImageGridList = (props) => {
  const { classes, imageList, square } = props;
  const [imageGrid, breakPoint] = imageList.length > 1
    ? [(
      <GridList cols={square} className={classes.root}>
        {imageList.map(image => (
          <GridListTile classes={classes} key={image.name}>
            <img style={Styles.fullImage} src={image.src} alt={image.name} />
          </GridListTile>
        ))}
      </GridList>), 4]
    : [<img style={Styles.fullImage} src={imageList[0].src} alt={imageList[0].name} />, 6];
  return (
    <Grid item xs={breakPoint}>
      {imageGrid}
    </Grid>
  );
};

ImageGridList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  imageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  square: PropTypes.number.isRequired,
};

export default withStyles(styles)(ImageGridList);
