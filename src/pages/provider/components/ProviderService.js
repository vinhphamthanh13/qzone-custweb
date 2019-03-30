import React, { Component } from 'react';
import {
  arrayOf, object, func, string,
} from 'prop-types';
import { get, chunk } from 'lodash';
import uuidv1 from 'uuid/v1';
import RateStar from 'components/Rating/RateStar';
import { Typography } from '@material-ui/core';
import { Schedule } from '@material-ui/icons';
import Rating from 'material-ui-rating';
import s from './ProviderService.module.scss';

class ProviderContent extends Component {
  handleRating = (customerId, providerId, ratingService) => (value) => {
    ratingService({
      customerId,
      serviceProviderId: providerId,
      rating: value,
      id: '',
    });
  };

  render() {
    const {
      services, customerId, ratingService, providerId,
    } = this.props;

    return (
      <div className={s.services}>
        {services.length > 0 && chunk(services, 2).map(chunked => (
          <div key={uuidv1()} className={s.serviceChunked}>
            {chunked.map((service) => {
              const srvImg = get(service, 'image.fileUrl');
              const rating = get(service, 'rating');
              const views = get(service, 'viewNum');
              const name = get(service, 'name');
              const description = get(service, 'description');
              const duration = get(service, 'duration');

              return (
                <div key={uuidv1()} className={s.serviceCard}>
                  <div className={s.serviceCardHeader}>
                    <div className={s.serviceImage}>
                      <img src={srvImg} alt={name} className="full-width" />
                    </div>
                    <div className={s.serviceTitle}>
                      <Typography variant="title" color="inherit">{name}</Typography>
                      <RateStar reviews={views} rating={rating} />
                    </div>
                    <div className={s.servingTime}>
                      <Schedule className="icon-small icon-main" />
                      <Typography variant="body1" color="inherit">{duration} minutes</Typography>
                    </div>
                  </div>
                  <div className={s.serviceCardBody}>
                    <Typography variant="body1" color="inherit">{description}</Typography>
                  </div>
                  { customerId ? (
                    <div className={s.ratingService}>
                      <div className={s.ratingLabel}>
                        <Typography
                          variant="subtitle2"
                          color="inherit"
                          className="text-bold"
                        >
                          Rate our quality on this service!
                        </Typography>
                      </div>
                      <Rating
                        max={5}
                        onChange={this.handleRating(customerId, providerId, ratingService)}
                        value={rating}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}

ProviderContent.propTypes = {
  services: arrayOf(object).isRequired,
  ratingService: func.isRequired,
  customerId: string,
  providerId: string.isRequired,
};

ProviderContent.defaultProps = {
  customerId: null,
};

export default ProviderContent;
