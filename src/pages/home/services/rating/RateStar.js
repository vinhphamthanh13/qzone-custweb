import React from 'react';
import { number } from 'prop-types';
import { Typography } from '@material-ui/core';
import { Star, StarHalf } from '@material-ui/icons';
import style from './RateStar.module.scss';


const RateStar = (props) => {
  const { rating, reviews } = props;
  return (
    <div className="flex">
      <div className="flex vertical-center">
        <Star className={style.iconStar} />
        <Star className={style.iconStar} />
        <Star className={style.iconStar} />
        <Star className={style.iconStar} />
        <StarHalf className={style.iconStar} />
      </div>
      <div className={`flex vertical-center ${style.reviews}`}>
        <Typography variant="body1" color="textSecondary">
          { Number(rating + reviews).toLocaleString() }
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
