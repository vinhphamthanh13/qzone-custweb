import React from 'react';
import {
  func,
} from 'prop-types';
import {
  Button,
  Typography,
} from '@material-ui/core';
import {
  AvTimer,
  DateRange,
  LocationOn,
  PersonPin,
  Book,
  Person,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import {
  serviceType,
} from 'types/global';
import {
  defaultDateFormat,
  AUTHENTICATED_KEY,
} from 'utils/constants';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import ClientInfo from './ClientInfo';
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
      captchaVerified: false,
      formValid: false,
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

  handleCaptchaVerified = (response) => {
    if (response) {
      this.setState({
        captchaVerified: true,
      });
    }
  };

  handleExpiredCaptchaCallback = () => {
    this.setState({
      captchaVerified: false,
    });
  };

  handleCaptchaLoad = () => {
    this.setState({
      captchaVerified: false,
    });
  };

  handleFormValidation = isValid => this.setState({ formValid: isValid });

  render() {
    const {
      bookingService,
    } = this.props;
    const {
      bookingDetail,
      userDetail,
      loginSession,
      captchaVerified,
      formValid,
    } = this.state;

    const serviceName = get(bookingService, 'name');
    const bookingTime = get(bookingDetail, 'time.start');
    const provider = get(bookingDetail, 'provider');
    const providerName = get(provider, 'providerName');
    const duration = get(provider, 'avgServiceTime');
    const fullAddress = get(provider, 'geoLocation.fullAddress');
    const providerRating = get(provider, 'rating');
    const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
    const isBookingValid = isAuthenticated || (formValid && captchaVerified);

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
              <AvTimer className="icon-main" />
              <Typography variant="subtitle1" color="inherit">
                {bookingTime && moment(bookingTime * 1000).format('hh:mm A')}{' - '}{duration} minutes
              </Typography>
            </div>
            <div className={s.bookingItems}>
              <Person className="icon-main" />
              <Typography variant="subtitle1" color="inherit" className="text-margin-right">
                {providerName}
              </Typography>
              <div>
                <RateStar rating={providerRating} />
              </div>
            </div>
            <div className={s.bookingItems}>
              <LocationOn className="icon-main" />
              <Typography variant="subtitle1" color="inherit" className="text-margin-right" noWrap>
                {fullAddress}
              </Typography>
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
              className="main-button"
              onClick={this.handleConfirmDialog(isBookingValid)}
              disabled={!isBookingValid}
            >
              <Book color="inherit" className="icon-small icon-in-button-left" />
              <Typography variant="body1" color="inherit">Book Now</Typography>
            </Button>
          </div>
        </div>
        <div className={s.clientInfo}>
          <div className={s.formTitle}>
            <Typography variant="title" color="inherit" className="text-bold">Client Info</Typography>
          </div>
          <div className="full-width">
            <ClientInfo
              handleFormValidation={this.handleFormValidation}
              userDetail={userDetail}
              verifyCallback={this.handleCaptchaVerified}
              expiredCallback={this.handleExpiredCaptchaCallback}
              onloadCallback={this.handleCaptchaLoad}
            />
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
  ...state.auth,
  ...state.booking,
});

export default connect(mapStatToProps)(React.memo(BookingDetail));
