import React from 'react';
import { arrayOf, object } from 'prop-types';
import { get } from 'lodash';
import uuidv1 from 'uuid/v1';
import RateStar from 'components/Rating/RateStar';
import { Typography } from '@material-ui/core';
import { Schedule } from '@material-ui/icons';
import s from './ProviderService.module.scss';

const ProviderContent = (props) => {
  const { services } = props;
  return (
    <div className={s.services}>
      {services.length > 0 && services.map((service) => {
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
          </div>
        );
      })}
    </div>
  );
};

ProviderContent.propTypes = {
  services: arrayOf(object).isRequired,
};

export default ProviderContent;
