import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';
import { LocationOn } from '@material-ui/icons';
import CustomLink from 'components/CustomLink';
import { serviceType } from 'types/global';

import GoogleMap from 'components/GoogleMap';
import mapStyles from './MapDialog.module.scss';
import styles from './providerContent/DetailDialog.module.scss';

export default function MapDialog({
  isOpen, toggle, initService, provider,
}) {
  const { geoLocation } = provider;
  return (
    <Dialog
      open={isOpen}
      onClose={toggle}
      maxWidth="xl"
      classes={{ paper: mapStyles.mapDialogWrapper }}
    >
      <DialogTitle disableTypography classes={{ root: styles.title }}>
        <div className={styles.leftTitle}>
          <Typography variant="h5">{initService.name}</Typography>
          <Typography variant="subtitle2">
            <CustomLink
              text={initService.organization.name}
              to={`/organisation/${initService.organization.id}`}
            />
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle1">{initService.duration} minutes</Typography>
        </div>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={16} className={mapStyles.mapWrapper}>
          <Grid item xs={12} className={mapStyles.addressLine}>
            <LocationOn className={mapStyles.icon} />
            <Typography variant="subtitle1" inline>
              {geoLocation.streetAddress},&nbsp;
              District {geoLocation.district},&nbsp;
              {geoLocation.state}&nbsp;
              {geoLocation.postCode}&nbsp;
              {geoLocation.country}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <GoogleMap
              marker={{
                longitude: geoLocation.coordinates.longitude,
                latitude: geoLocation.coordinates.latitude,
              }}
              zoom={16}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions classes={{ root: styles.footer }}>
        <Button variant="outlined" color="primary" onClick={toggle}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

MapDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initService: serviceType,
  provider: PropTypes.shape({
    geoLocation: {
      coordinates: {
        longitude: PropTypes.number,
        latitude: PropTypes.number,
      },
    },
  }),
};

MapDialog.defaultProps = {
  initService: undefined,
  provider: {
    geoLocation: {
      coordinates: {},
    },
  },
};
