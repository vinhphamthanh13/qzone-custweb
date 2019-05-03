import React, { Component } from 'react';
import {
  arrayOf, object, func, string, any,
} from 'prop-types';
import { get, chunk } from 'lodash';
import uuidv1 from 'uuid/v1';
import RateStar from 'components/Rating/RateStar';
import { Typography } from '@material-ui/core';
import { AvTimer } from '@material-ui/icons';
import Rating from 'material-ui-rating';
import s from './ProviderService.module.scss';

class ProviderContent extends Component {
  handleRating = (customerId, serviceProviderId, ratingService) => (value) => {
    ratingService({
      customerId,
      serviceProviderId,
      rating: value,
    });
  };

  render() {
    const {
      providerServices,
      customerId,
      ratingService,
      providerId,
      serviceProviders,
    } = this.props;

    return (
      <div className={s.services}>
        {providerServices && providerServices.length > 0 && chunk(providerServices, 2).map(chunked => (
          <div key={uuidv1()} className={s.serviceChunked}>
            {chunked.map((service) => {
              const srvImg = get(service, 'image.fileUrl');
              const name = get(service, 'name');
              const description = get(service, 'description');
              const duration = get(service, 'duration');
              const serviceId = get(service, 'id');
              const serviceProvider = serviceProviders
                .filter(item => item.providerId === providerId && item.serviceId === serviceId);
              const serviceProviderId = get(serviceProvider, '0.id');
              const providerRating = get(serviceProvider, '0.rating');
              return (
                <div key={uuidv1()} className={s.serviceCard}>
                  <div className={s.serviceCardHeader}>
                    <div className={s.serviceImage}>
                      <img src={srvImg} alt={name} className="full-width" />
                    </div>
                    <div className={s.serviceTitle}>
                      <Typography variant="title" color="inherit">{name}</Typography>
                      <RateStar />
                    </div>
                    <div className={s.servingTime}>
                      <AvTimer className="icon-small icon-main" />
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
                          {providerRating ? 'Thanks for rating our quality!' : 'Rate our quality on this service!'}
                        </Typography>
                      </div>
                      <Rating
                        readOnly={!!providerRating}
                        max={5}
                        onChange={this.handleRating(customerId, serviceProviderId, ratingService)}
                        value={providerRating}
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
  providerServices: arrayOf(object).isRequired,
  ratingService: func.isRequired,
  customerId: string,
  providerId: string.isRequired,
  serviceProviders: arrayOf(any).isRequired,
};

ProviderContent.defaultProps = {
  customerId: null,
};

export default ProviderContent;
