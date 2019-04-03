import React from 'react';
import {
  number, shape, bool, func, string,
} from 'prop-types';
import { Typography, Dialog, IconButton } from '@material-ui/core';
import { LocationOnOutlined, CloseSharp } from '@material-ui/icons';
import { get } from 'lodash';
import GoogleMap from 'components/GoogleMap';
import s from './MapDialog.module.scss';

export default function MapDialog({
  isOpen, toggle, provider, serviceName,
}) {
  const providerStreet = get(provider, 'geoLocation.streetAddress');
  const providerDistrict = get(provider, 'geoLocation.district');
  const providerState = get(provider, 'geoLocation.state');
  const providerCountry = get(provider, 'geoLocation.country');
  const providerPostCode = get(provider, 'geoLocation.postCode');
  const providerLat = get(provider, 'geoLocation.coordinates.latitude');
  const providerLng = get(provider, 'geoLocation.coordinates.longitude');

  return (
    <Dialog
      open={isOpen}
      onClose={toggle}
      disableBackdropClick
      maxWidth="xl"
      classes={{ paper: s.mapDialogWrapper }}
    >
      <div className={s.mapContainer}>
        <div>
          <div className={s.closeMap}>
            <IconButton className="simple-button" onClick={toggle}>
              <CloseSharp className="icon-white icon-normal" />
            </IconButton>
          </div>
          <div className={s.mapTitle}>
            <Typography variant="title" className="text-bold text-margin-right">{serviceName}</Typography>
          </div>
          <div className={s.providerLocation}>
            <div className="icon-text">
              <LocationOnOutlined className="icon-main icon-small" />
              <Typography variant="subtitle2">
                {providerStreet}, {providerDistrict}, {providerState}, {providerPostCode},  {providerCountry}
              </Typography>
            </div>
          </div>
        </div>
        <div className={s.mapBody}>
          <div className={s.mapContainer}>
            <GoogleMap
              marker={{
                longitude: providerLng,
                latitude: providerLat,
              }}
              zoom={16}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

MapDialog.propTypes = {
  isOpen: bool.isRequired,
  toggle: func.isRequired,
  serviceName: string.isRequired,
  provider: shape({
    geoLocation: {
      coordinates: {
        longitude: number,
        latitude: number,
      },
    },
  }),
};

MapDialog.defaultProps = {
  provider: {
    geoLocation: {
      coordinates: {},
    },
  },
};
