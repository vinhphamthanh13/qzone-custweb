import React from 'react';
import { bool, arrayOf, func } from 'prop-types';
import { Grid } from '@material-ui/core';
import { serviceType } from 'types/global';
import EmptyItem from 'components/EmptyItem';
import ServiceCard from './services/ServiceCard';
import s from './Services.module.scss';

export default function Services({
  services,
  isLoading,
  onBooking,
}) {
  return (
    <>
      <Grid container className={s.cardsWrapper} justify="center">
        {
          !isLoading && services && services.length === 0
          && <EmptyItem message="No service available!" />
        }
        {services && services.map(service => (
          <Grid item xs={10} sm={6} md={3} key={service.id}>
            <ServiceCard service={service} onBooking={onBooking} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

Services.propTypes = {
  services: arrayOf(serviceType).isRequired,
  isLoading: bool.isRequired,
  onBooking: func.isRequired,
};
