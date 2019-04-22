import React from 'react';
import {
  func,
  bool,
} from 'prop-types';
import {
  Button, TextField, Typography,
} from '@material-ui/core';
import {
  Schedule, DateRange, LocationOn, PersonPin,
} from '@material-ui/icons';
import { connect } from 'react-redux';
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

  handleBooking = () => {
    const { onSaveBooking, openDialog, isAuthenticated } = this.props;
    if (isAuthenticated) {
      onSaveBooking();
    } else {
      openDialog('isLoginOpen');
    }
  };

  render() {
    const {
      bookingDetail, initService, userDetail, isAuthenticated,
    } = this.props;
    const serviceName = get(initService, 'name');
    const localBookingStartTime = mtz(bookingDetail.time.start);
    const provider = get(bookingDetail, 'provider');
    const providerName = get(provider, 'providerName');
    const duration = get(provider, 'avgServiceTime');
    const providerRating = get(provider, 'rating');

    return (
      <div className={s.bookingAppointment}>
        <div className={s.bookingDetail}>
          <div className={s.bookingHeadInfo}>
            <div className={s.serviceTitle}>
              <Typography variant="title" color="textSecondary" className="text-bold">{initService.name}</Typography>
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
                {localBookingStartTime.format('hh:mm A')}{' - '}{duration} minutes
              </Typography>
            </div>
            <div className={s.bookingItems}>
              <LocationOn className="icon-main" />
              <Typography variant="subtitle1" color="inherit" className="text-margin-right">
                {providerName}
              </Typography>
              <div>
                <RateStar rating={providerRating} />
              </div>
            </div>
            <div className={s.bookingItems}>
              <PersonPin className="icon-main icon-shake" onClick={this.toggleMapDialog} />
              <Typography
                variant="subtitle1"
                color="inherit"
                onClick={this.toggleMapDialog}
                className="hover-pointer"
              >
                View map
              </Typography>
            </div>
          </div>
          <div className={s.bookingCta}>
            <Button
              variant="contained"
              className="button-normal main-button"
              onClick={this.handleBooking}
            >
              {isAuthenticated ? 'Book now!' : 'Sign in'}
            </Button>
          </div>
        </div>
        <div className={s.clientInfo}>
          <div className={s.formTitle}>
            <Typography variant="title" color="inherit" className="text-bold">Client Info</Typography>
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
          serviceName={serviceName}
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
  onSaveBooking: func.isRequired,
  isAuthenticated: bool.isRequired,
  openDialog: func.isRequired,
};

BookingDetail.defaultProps = {
  initService: undefined,
};

const mapStatToProps = state => ({
  isAuthenticated: state.auth.loginSession.isAuthenticated,
  providerList: state.home.providerList,
});

export default connect(mapStatToProps)(React.memo(BookingDetail));
