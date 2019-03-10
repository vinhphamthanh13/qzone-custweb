import React from 'react';
import { number } from 'prop-types';
import { Typography } from '@material-ui/core';
import { Star, StarHalf } from '@material-ui/icons';
import style from './RateStar.module.scss';


const RateStar = (props) => {
  const { rating, reviews } = props;
  const fullStar = parseInt(rating, 0);
  const halfStar = rating % 1;
  return (
    <div className="flex">
      <div className="flex v-center">
        {Array.from({ length: fullStar }, () => (
          <Star key={Math.random() * 10} className={style.iconStar} />
        ))}
        { halfStar > 0 && <StarHalf className={style.iconStar} /> }
      </div>
      <div className={`flex v-center ${style.reviews}`}>
        <Typography variant="body1" color="textSecondary">
          { reviews }
        </Typography>
      </div>
    </div>
  );
};

RateStar.propTypes = {
  rating: number.isRequired,
  reviews: number.isRequired,
};

export default RateStar;
