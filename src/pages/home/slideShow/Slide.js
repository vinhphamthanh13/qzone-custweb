import React, { Component } from 'react';
import {
  number, string, func, bool,
} from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import { Domain } from '@material-ui/icons';
import CustomLink from 'components/CustomLink';
import { READ_MORE_MAX } from 'utils/constants';
import RateStar from 'components/Rating/RateStar';
import ReadMore from '../services/readMore/ReadMore';
import s from './Slide.module.scss';

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
      imageUrl,
      name,
      description,
      rating,
      reviews,
      onBooking,
      orgName,
      orgId,
      disabledBooking,
    } = this.props;
    const { isReadMoreOpen } = this.state;

    return (
      <>
        <ReadMore
          isOpen={isReadMoreOpen}
          onClose={this.handleCloseReadMore}
          serviceName={name}
          orgName={orgName}
          orgId={orgId}
          orgDescription={description}
          onBooking={this.handleReadMoreBooking}
          rating={rating}
          reviews={reviews}
        />
        <div className={s.wrapper}>
          <div className={s.image}>
            <img src={imageUrl} alt={name} width="100%" height="100%" />
          </div>
          <div className={s.content}>
            <div>
              <div className={s.title}>
                <Typography variant="headline" color="inherit" noWrap>
                  {name}
                </Typography>
              </div>
              <div className={s.rating}>
                <RateStar rating={rating} reviews={reviews} />
              </div>
              <div className={s.description}>
                { description.split('').length > READ_MORE_MAX ? (
                  <Typography variant="body1" color="textSecondary">
                    {description.split('').slice(0, READ_MORE_MAX)}... <CustomLink
                      text="Read more"
                      small
                      to="#"
                      onClick={this.handleOpenReadMore}
                    />
                  </Typography>
                ) : <Typography variant="body1" color="textSecondary">{description}</Typography>
                }
              </div>
            </div>
            {false && (
              <div className={s.cta}>
                <div className={s.blockItem}>
                  <div className={s.iconInfo}>
                    <Domain className={s.icon} />
                    <Typography variant="body1" noWrap>
                      <CustomLink text={orgName} to={`/organization/${orgId}`} />
                    </Typography>
                  </div>
                </div>
                <Button
                  disabled={disabledBooking}
                  onClick={onBooking}
                  variant="outlined"
                  className="main-button"
                >Book Now!
                </Button>
              </div>)
            }
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
  orgName: string.isRequired,
  orgId: string.isRequired,
  disabledBooking: bool.isRequired,
};

Slide.defaultProps = {
  rating: 0,
  reviews: 0,
  description: '',
};

export default Slide;
