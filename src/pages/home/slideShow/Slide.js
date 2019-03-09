import React from 'react';
import { number, string } from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import RateStar from '../services/rating/RateStar';
import style from './Slide.module.scss';

const Slide = (props) => {
  const {
    imageUrl, name, description, rating, reviews,
  } = props;
  return (
    <div className={style.wrapper}>
      <div className={style.image}>
        <img src={imageUrl} alt={name} width="100%" height="100%" />
      </div>
      <div className={style.content}>
        <div>
          <div className={style.title}>
            <Typography variant="headline" color="textSecondary">{name}</Typography>
          </div>
          <div className={style.rating}>
            <RateStar rating={rating} reviews={reviews} />
          </div>
          <div className={style.description}>
            <Typography variant="body1" color="textSecondary">{description}</Typography>
          </div>
        </div>
        <div>
          <Button variant="outlined" className="main-button">Book Now!</Button>
        </div>
      </div>
    </div>
  );
};

Slide.propTypes = {
  imageUrl: string.isRequired,
  name: string.isRequired,
  description: string.isRequired,
  rating: number,
  reviews: number,
};

Slide.defaultProps = {
  rating: 0,
  reviews: 0,
};

export default Slide;
