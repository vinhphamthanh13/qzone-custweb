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
  const fullAddress = get(provider, 'fullAddress');
  const providerLat = get(provider, 'coordinates.latitude');
  const providerLng = get(provider, 'coordinates.longitude');

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
            <Typography
              variant="title"
              color="inherit"
              className="text-bold full-width"
              noWrap
            >{serviceName}
            </Typography>
          </div>
          <div className={s.providerLocation}>
            <div className="icon-text">
              <LocationOnOutlined className="icon-main icon-small" />
              <Typography variant="subtitle2">
                {fullAddress}
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
