import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, TextField, Typography,
} from '@material-ui/core';
import {
  Schedule, DateRange, LocationOn, PersonPin, Call,
} from '@material-ui/icons';
import { get } from 'lodash';
import mtz from 'moment-timezone';
import { bookingDetailType, serviceType, userDetailType } from 'types/global';
import { defaultDateFormat } from 'utils/constants';
import formatName from 'utils/formatName';
import RateStar from 'components/Rating/RateStar';
import MapDialog from './selectProvider/MapDialog';
import s from './BookingDetail.module.scss';

class BookingDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMapDialogOpen: false,
    };
  }

  toggleMapDialog = () => {
    this.setState(oldState => ({ isMapDialogOpen: !oldState.isMapDialogOpen }));
  };

  render() {
    const {
      bookingDetail, initService, userDetail, onSaveBooking,
    } = this.props;
    const localBookingStartTime = mtz(bookingDetail.time.start);
    const provider = get(bookingDetail, 'provider');
    const providerPhone = get(provider, 'telephone');

    return (
      <div className={s.bookingAppointment}>
        <div className={s.bookingDetail}>
          <div className={s.bookingHeadInfo}>
            <div className={s.serviceTitle}>
              <Typography variant="title" color="textSecondary">{initService.name}</Typography>
            </div>
            <div>
              <RateStar reviews={initService.viewNum} rating={initService.rating} />
            </div>
          </div>
          <div className={s.serviceItems}>
            <div className={s.bookingItems}>
              <DateRange className="icon-main" />
              <Typography variant="subtitle1" color="inherit">
                {localBookingStartTime.format(defaultDateFormat)}
              </Typography>
            </div>
            <div className={s.bookingItems}>
              <Schedule className="icon-main" />
              <Typography variant="subtitle1" color="inherit">
                {localBookingStartTime.format('hh:mm A')}
              </Typography>
            </div>
            <div className={s.bookingItems}>
              <LocationOn className="icon-main" />
              <Typography variant="subtitle1" color="inherit">
                {formatName({
                  givenName: bookingDetail.provider.givenName,
                  familyName: bookingDetail.provider.familyName,
                })}
              </Typography>
            </div>
            <div className={s.bookingItems}>
              <Call className="icon-main" />
              <Typography variant="subtitle1" color="inherit">
                {providerPhone}
              </Typography>
            </div>
            <div className={s.bookingItems}>
              <PersonPin className="icon-main icon-shake" onClick={this.toggleMapDialog} />
              <Typography
                variant="subtitle1"
                color="inherit"
                onClick={this.toggleMapDialog}
                className="text-bold"
              >
                View map
              </Typography>
            </div>
          </div>
          <div className={s.bookingCta}>
            <Button variant="contained" className="button-normal main-button" onClick={onSaveBooking}>
              Book now!
            </Button>
          </div>
        </div>
        <div className={s.clientInfo}>
          <div className={s.formTitle}>
            <Typography variant="title" color="inherit">Client Info</Typography>
          </div>
          <div>
            <div className={s.formFields}>
              <TextField
                disabled
                fullWidth
                label="Client name"
                value={formatName({ givenName: userDetail.givenName, familyName: userDetail.familyName })}
                margin="dense"
              />
              <TextField
                disabled
                fullWidth
                label="Email"
                value={userDetail.email || ''}
                margin="dense"
              />
              <TextField
                disabled
                fullWidth
                label="Phone number"
                value={userDetail.telephone || ''}
                margin="dense"
              />
            </div>
          </div>
        </div>
        <MapDialog
          isOpen={this.state.isMapDialogOpen}
          toggle={this.toggleMapDialog}
          initService={initService}
          provider={bookingDetail.provider}
        />
      </div>
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
