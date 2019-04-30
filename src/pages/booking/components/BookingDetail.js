import React from 'react';
import {
  func,
} from 'prop-types';
import {
  Button, TextField, Typography,
} from '@material-ui/core';
import {
  Schedule, DateRange, LocationOn, PersonPin,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import {
  serviceType,
} from 'types/global';
import { defaultDateFormat } from 'utils/constants';
import formatName from 'utils/formatName';
import RateStar from 'components/Rating/RateStar';
import MapDialog from './selectProvider/MapDialog';
import s from './BookingDetail.module.scss';

class BookingDetail extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    const {
      bookingDetail,
      userDetail,
      loginSession,
    } = props;
    const {
      bookingDetail: cachedBookingDetail,
      userDetail: cachedUserDetail,
      loginSession: cachedLoginSession,
    } = state;
    if (
      bookingDetail !== cachedBookingDetail
      || userDetail !== cachedUserDetail
      || loginSession !== cachedLoginSession
    ) {
      return {
        bookingDetail,
        userDetail,
        loginSession,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isMapDialogOpen: false,
      bookingDetail: null,
      userDetail: null,
      loginSession: null,
    };
  }

  toggleMapDialog = () => {
    this.setState(oldState => ({ isMapDialogOpen: !oldState.isMapDialogOpen }));
  };

  handleConfirmDialog = isAuthenticated => () => {
    const { handleConfirmDialog, handleAuth } = this.props;
    if (isAuthenticated) {
      handleConfirmDialog();
    } else {
      handleAuth('isLoginOpen');
    }
  };

  render() {
    const {
      bookingService,
    } = this.props;
    const {
      bookingDetail,
      userDetail,
      loginSession,
    } = this.state;
    console.log('prop of booking details', this.props);
    console.log('state of booking details', this.state);
    const serviceName = get(bookingService, 'name');
    const bookingTime = get(bookingDetail, 'time.start');
    const provider = get(bookingDetail, 'provider');
    const providerName = get(provider, 'providerName');
    const duration = get(provider, 'avgServiceTime');
    const providerRating = get(provider, 'rating');
    const userGiven = get(userDetail, 'givenName');
    const userFamily = get(userDetail, 'familyName');
    const userEmail = get(userDetail, 'email');
    const userPhone = get(userDetail, 'telephone');
    const isAuthenticated = get(loginSession, 'isAuthenticated');

    return (
      <div className={s.bookingAppointment}>
        <div className={s.bookingDetail}>
          <div className={s.bookingHeadInfo}>
            <div className={s.serviceTitle}>
              <Typography variant="title" color="textSecondary" className="text-bold">{serviceName}</Typography>
            </div>
          </div>
          <div className={s.serviceItems}>
            <div className={s.bookingItems}>
              <DateRange className="icon-main" />
              <Typography variant="subtitle1" color="inherit">
                {bookingTime && moment(bookingTime * 1000).format(defaultDateFormat)}
              </Typography>
            </div>
            <div className={s.bookingItems}>
              <Schedule className="icon-main" />
              <Typography variant="subtitle1" color="inherit">
                {bookingTime && moment(bookingTime * 1000).format('hh:mm A')}{' - '}{duration} minutes
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
              variant="outlined"
              className="button-normal main-button"
              onClick={this.handleConfirmDialog(isAuthenticated)}
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
                value={formatName({ givenName: userGiven, familyName: userFamily })}
                margin="dense"
              />
              <TextField
                disabled
                fullWidth
                label="Email"
                value={userEmail || ''}
                margin="dense"
              />
              <TextField
                disabled
                fullWidth
                label="Phone number"
                value={userPhone || ''}
                margin="dense"
              />
            </div>
          </div>
        </div>
        <MapDialog
          isOpen={this.state.isMapDialogOpen}
          toggle={this.toggleMapDialog}
          serviceName={serviceName}
          provider={provider}
        />
      </div>
    );
  }
}

BookingDetail.propTypes = {
  bookingService: serviceType,
  handleConfirmDialog: func.isRequired,
  handleAuth: func.isRequired,
};

BookingDetail.defaultProps = {
  bookingService: null,
};

const mapStatToProps = state => ({
  ...state.booking,
  ...state.auth,
});

export default connect(mapStatToProps)(React.memo(BookingDetail));
