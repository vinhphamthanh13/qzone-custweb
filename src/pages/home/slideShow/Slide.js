import React, { Component } from 'react';
import { number, string, func } from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import { AccessTime, LocationOn } from '@material-ui/icons';
import CustomLink from 'components/CustomLink';
import { READ_MORE_MAX } from 'utils/constants';
import RateStar from '../services/rating/RateStar';
import ReadMore from '../services/readMore/ReadMore';
import style from './Slide.module.scss';

class Slide extends Component {
  state = {
    isReadMoreOpen: false,
  };

  handleCloseReadMore = () => {
    this.setState({ isReadMoreOpen: false });
  };

  handleOpenReadMore = (event) => {
    event.preventDefault();
    this.setState({ isReadMoreOpen: true });
  };

  handleReadMoreBooking = () => {
    const { onBooking } = this.props;
    onBooking();
    this.handleCloseReadMore();
  };

  render() {
    const {
      imageUrl, name, description, rating, reviews, onBooking,
      duration, orgName, orgId,
    } = this.props;
    const { isReadMoreOpen } = this.state;

    return (
      <>
        <ReadMore
          isOpen={isReadMoreOpen}
          onClose={this.handleCloseReadMore}
          serviceName={name}
          duration={duration}
          orgName={orgName}
          orgId={orgId}
          orgDescription={description}
          instantBooking={this.handleReadMoreBooking}
          rating={rating}
          reviews={reviews}
        />
        <div className={style.wrapper}>
          <div className={style.image}>
            <img src={imageUrl} alt={name} width="100%" height="100%" />
          </div>
          <div className={style.content}>
            <div>
              <div className={style.title}>
                <Typography variant="headline" color="textSecondary" noWrap>
                  {name}
                </Typography>
              </div>
              <div className={style.rating}>
                <RateStar rating={rating} reviews={reviews} />
              </div>
              <div className={style.description}>
                { description.split('').length > READ_MORE_MAX ? (
                  <Typography variant="body1" color="textSecondary">
                    {description.split('').slice(0, READ_MORE_MAX)}... <CustomLink
                      text="Read more"
                      small
                      to="#"
                      onClick={this.handleOpenReadMore}
                    />
                  </Typography>
                ) : null}
              </div>
              <div className={style.blockItem}>
                <div className={style.iconInfo}>
                  <AccessTime className={style.icon} />
                  <Typography variant="body1" color="primary">{duration} minutes</Typography>
                </div>
                <div className={style.iconInfo}>
                  <LocationOn className={style.icon} />
                  <Typography variant="body1">
                    <CustomLink text={orgName} to={`/organisation/${orgId}`} />
                  </Typography>
                </div>
              </div>
            </div>
            <div>
              <Button onClick={onBooking} variant="outlined" className="main-button">Book Now!</Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Slide.propTypes = {
  imageUrl: string.isRequired,
  name: string.isRequired,
  description: string,
  rating: number,
  reviews: number,
  onBooking: func.isRequired,
  duration: number.isRequired,
  orgName: string.isRequired,
  orgId: string.isRequired,
};

Slide.defaultProps = {
  rating: 0,
  reviews: 0,
  description: '',
};

export default Slide;
