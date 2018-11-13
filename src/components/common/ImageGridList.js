import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';

const ImageGridList = (props) => {
  const { imageList, colx2 } = props;
  const [imageGrid, breakPoint] = imageList.length > 1
    ? [(
      <GridList cols={colx2 * 2} spacing={16}>
        {imageList.map(image => (
          <GridListTile key={image.id}>
            <img width="100%" height="100%" src={image.src} alt={image.name} />
          </GridListTile>
        ))}
      </GridList>), 4]
    : [<img width="100%" height="100%" src={imageList[0].src} alt={imageList[0].name} />, 6];
  const xsBreakPoint = colx2 < 1 ? 12 : 10;
  return (
    <Grid item xs={xsBreakPoint} md={breakPoint}>
      {imageGrid}
    </Grid>
  );
};

ImageGridList.propTypes = {
  imageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  colx2: PropTypes.number.isRequired,
};

export default ImageGridList;
