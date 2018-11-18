import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid } from '@material-ui/core';
import { format } from 'date-fns';
import { serviceType, providerType } from 'types/global';
import './TabService.scss';

export default function TabService({
  providers, service, selectedDate, selectedTime,
}) {
  return (
    <div>
      <Typography variant="title">{service.name}</Typography>
      <div className="tab-service__detail">
        <div className="tab-service__detail-item">
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="caption">Date:</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subtitle2">{format(selectedDate, 'dd MMM yyyy')}</Typography>
            </Grid>
          </Grid>
        </div>
        <div className="tab-service__detail-item">
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="caption">Start at:</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subtitle2">{selectedTime.time}</Typography>
            </Grid>
          </Grid>
        </div>
        <div className="tab-service__detail-item">
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="caption">Service provider:</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subtitle2">
                {providers.find(provider => provider.id === selectedTime.providerId).name}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div className="tab-service__detail-item">
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="caption">Organisation:</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subtitle2">
                Organisation 1
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

TabService.propTypes = {
  providers: PropTypes.arrayOf(providerType).isRequired,
  service: serviceType.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  selectedTime: PropTypes.shape({
    providerId: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
};
