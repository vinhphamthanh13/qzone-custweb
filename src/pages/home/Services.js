import React from 'react';
import { func, bool, arrayOf } from 'prop-types';
import { Grid } from '@material-ui/core';
import { serviceType } from 'types/global';
import EmptyItem from 'components/EmptyItem';
import styles from './Services.module.scss';
import ServiceCard from './services/ServiceCard';

export default function Services({
  services,
  onChange,
  isLoading,
  onLoadServices,
}) {
  return (
    <>
      <Grid container className={styles.cardsWrapper} justify="center">
        {
          !isLoading && services.length === 0
          && <EmptyItem onLoadServices={onLoadServices} />
        }
        {services.map(service => (
          <Grid item xs={10} sm={6} md={3} key={service.id}>
            <ServiceCard onChange={onChange} service={service} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

Services.propTypes = {
  services: arrayOf(serviceType).isRequired,
  onChange: func.isRequired,
  isLoading: bool.isRequired,
  onLoadServices: func.isRequired,
};
