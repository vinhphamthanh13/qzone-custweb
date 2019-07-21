import React from 'react';
import {
  func,
} from 'prop-types';
import {
  Button,
  Typography,
  IconButton,
} from '@material-ui/core';
import {
  AvTimer,
  DateRange,
  LocationOn,
  PersonPin,
  Book,
  Person,
  Edit,
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
import {
  saveGuestInfo,
} from 'authentication/actions/login';
import MapDialog from 'components/Map/MapDialog';
import ClientInfo from './ClientInfo';
import s from './BookingDetail.module.scss';

class BookingDetail extends React.PureComponent {
  static propTypes = {
    bookingService: serviceType,
    handleConfirmDialog: func.isRequired,
    saveGuestInfo: func.isRequired,
  };

  static defaultProps = {
    bookingService: null,
  };

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
    const { handleConfirmDialog } = this.props;
    if (isAuthenticated) {
      handleConfirmDialog();
    }
  };

  verifyCaptcha = () => {
    this.setState({
      captchaVerified: true,
    });
  };

  handleCaptchaVerified = (response, userInfo) => {
    const { saveGuestInfo: saveGuestInfoAction } = this.props;
    if (response) {
      saveGuestInfoAction(userInfo, this.verifyCaptcha);
    }
  };

  handleInvalidCaptcha = () => {
    this.setState({
      captchaVerified: false,
    });
  };

  handleFormValidation = isValid => this.setState({ formValid: isValid });

  handleGuestInfo = (values) => {
    const givenName = get(values, 'userName');
    const email = get(values, 'userEmail');
    const phone = get(values, 'phoneNumber');
    return {
      givenName,
      email,
      phone,
      userType: 'GUEST',
    };
  };

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
            <Typography variant="title" color="inherit" className="text-bold">{serviceName}</Typography>
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
            <IconButton disabled={!userDetail}>
              <Edit className="icon-small icon-transparent" />
            </IconButton>
          </div>
          <div className="full-width">
            <ClientInfo
              handleFormValidation={this.handleFormValidation}
              userDetail={userDetail}
              verifyCallback={this.handleCaptchaVerified}
              expiredCallback={this.handleInvalidCaptcha}
              onloadCallback={this.handleInvalidCaptcha}
              handleGuestInfo={this.handleGuestInfo}
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

const mapStatToProps = state => ({
  ...state.auth,
  ...state.booking,
});

export default connect(mapStatToProps, {
  saveGuestInfo,
})(React.memo(BookingDetail));
