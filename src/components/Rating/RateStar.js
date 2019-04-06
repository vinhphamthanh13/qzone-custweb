import React from 'react';
import { number } from 'prop-types';
import { Typography } from '@material-ui/core';
import { Star, StarHalf, StarBorder } from '@material-ui/icons';
import style from './RateStar.module.scss';


const RateStar = (props) => {
  const { rating, reviews } = props;
  const fullStar = parseInt(rating, 0);
  const halfStar = rating % 1;
  const borderStar = Object.is(rating, null) || rating === 0;
  const comments = Object.is(reviews, null) || Object.is(reviews, undefined) || reviews === 0
    ? '' : reviews;
  return (
    <div className="flex">
      <div className="flex v-center icon-margin-sm">
        {Array.from({ length: fullStar }, () => (
          <Star key={Math.random() * 10} className={style.iconStar} />
        ))}
        { halfStar > 0 && <StarHalf className={style.iconStar} /> }
        { borderStar && <StarBorder className={style.iconStar} />}
      </div>
      {reviews > 0 && (
        <div className={`flex v-center ${style.reviews}`}>
          <Typography variant="body1" color="textSecondary">
            { comments }
          </Typography>
        </div>
      )}
    </div>
  );
};

RateStar.propTypes = {
  rating: number,
  reviews: number,
};

RateStar.defaultProps = {
  rating: 0,
  reviews: 0,
};

export default RateStar;
