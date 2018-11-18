import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Button } from '@material-ui/core';
import { providerType } from 'types/global';

export default function TabProviders({
  providers, selectedTime, onSelectTime,
}) {
  return (
    providers.map(provider => (
      <div key={provider.id} className="service-card__provider-time">
        <Typography>{provider.name}</Typography>
        <Grid container spacing={8}>
          {provider.availableSlots.map(time => (
            <Grid item sm={3} key={time}>
              <Button
                variant={selectedTime.providerId === provider.id && selectedTime.time === time
                  ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => { onSelectTime(provider.id, time); }}
              >
                {time}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>
    ))
  );
}

TabProviders.propTypes = {
  providers: PropTypes.arrayOf(providerType).isRequired,
  selectedTime: PropTypes.shape({
    providerId: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  onSelectTime: PropTypes.func.isRequired,
};
