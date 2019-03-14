import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, TextField, Typography, Fab,
} from '@material-ui/core';
import mtz from 'moment-timezone';
import { bookingDetailType, serviceType, userDetailType } from 'types/global';
import { defaultDateFormat } from 'utils/constants';
import formatName from 'utils/formatName';
import MapDialog from './selectProvider/MapDialog';
import styles from './BookingDetail.module.scss';

class BookingDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMapDialogOpen: false,
    };
  }

  toggleMapDialog = () => {
    this.setState(oldState => ({ isMapDialogOpen: !oldState.isMapDialogOpen }));
  }

  render() {
    const {
      bookingDetail, initService, userDetail, onSaveBooking,
    } = this.props;
    const localBookingStartTime = mtz(bookingDetail.time.start);

    return (
      <>
        <Grid container className={styles.wrapper}>
          <Grid item md={6} className={styles.userInfo}>
            <TextField
              disabled
              fullWidth
              label="Name"
              value={formatName({ givenName: userDetail.givenName, familyName: userDetail.familyName })}
              margin="normal"
              variant="outlined"
            />
            <TextField
              disabled
              fullWidth
              label="Email"
              value={userDetail.email || ''}
              margin="normal"
              variant="outlined"
            />
            <TextField
              disabled
              fullWidth
              label="Phone number"
              value={userDetail.telephone || ''}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item md={5} className={styles.service}>
            <Typography variant="h5">{initService.name}</Typography>
            <div className={styles.serviceItems}>
              <Grid container>
                <Grid item md={5}><Typography variant="body1">Date:</Typography></Grid>
                <Grid item md={7}>
                  <Typography variant="subtitle1" color="secondary">
                    {localBookingStartTime.format(defaultDateFormat)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={5}><Typography variant="body1">Starts at:</Typography></Grid>
                <Grid item md={7}>
                  <Typography variant="subtitle1" color="secondary">
                    {localBookingStartTime.format('hh:mm A')}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={5}><Typography variant="body1">Service provider:</Typography></Grid>
                <Grid item md={7}>
                  <Typography variant="subtitle1" color="secondary">
                    {formatName({
                      givenName: bookingDetail.provider.givenName,
                      familyName: bookingDetail.provider.familyName,
                    })}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <div className={styles.serviceItems}>
              <Fab color="primary" variant="extended" onClick={onSaveBooking}>
                Book now
              </Fab>
              <Fab variant="extended" onClick={this.toggleMapDialog} className={styles.viewMapButton}>
                View map
              </Fab>
            </div>
          </Grid>
        </Grid>
        <MapDialog
          isOpen={this.state.isMapDialogOpen}
          toggle={this.toggleMapDialog}
          initService={initService}
          provider={bookingDetail.provider}
        />
      </>
    );
  }
}

BookingDetail.propTypes = {
  bookingDetail: bookingDetailType.isRequired,
  initService: serviceType,
  userDetail: userDetailType.isRequired,
  onSaveBooking: PropTypes.func.isRequired,
};

BookingDetail.defaultProps = {
  initService: undefined,
};

export default React.memo(BookingDetail);
