import React from 'react';
import { number, string } from 'prop-types';
import { Typography } from '@material-ui/core';
import { Star, StarHalf, StarBorder } from '@material-ui/icons';
import s from './RateStar.module.scss';

const RateStar = (props) => {
  const { rating, reviews, size } = props;
  const fullStar = parseInt(rating, 0);
  const halfStar = rating % 1;
  const borderStar = Object.is(rating, null) || rating === 0;
  const comments = Object.is(reviews, null) || Object.is(reviews, undefined) || reviews === 0
    ? '' : reviews;
  const starSize = `galliano-color icon-${size} ${s.star}`; // small, normal (default), big, lg
  return (
    <div className="flex">
      <div className="flex v-center">
        {Array.from({ length: fullStar }, () => (
          <Star key={Math.random() * 10} className={starSize} />
        ))}
        { halfStar > 0 && <StarHalf className={starSize} /> }
        { borderStar && <StarBorder className={starSize} />}
      </div>
      {reviews > 0 && (
        <div className={`flex v-center ${s.reviews}`}>
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
  size: string,
};

RateStar.defaultProps = {
  rating: 0,
  reviews: 0,
  size: 'normal',
};

export default RateStar;
