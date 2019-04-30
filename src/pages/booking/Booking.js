import React, { PureComponent } from 'react';
import {
  string,
  func,
  number,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import {
  get,
  uniqBy,
} from 'lodash';
import {
  userDetailType,
} from 'types/global';
import {
  IconButton,
  Avatar,
  Button,
  Typography,
} from '@material-ui/core';
import {
  Home,
  ChevronLeft,
  ChevronRight,
} from '@material-ui/icons';
import logo from 'images/quezone-logo.png';
import CustomModal from 'components/Modal/CustomModal';
import Loading from 'components/Loading';
import Error from 'components/Error';
import { history } from 'containers/App';
import { BOOKING } from 'utils/constants';
import { setServiceProvidersAction } from 'actionsReducers/home.actions';
import {
  getServiceByIdAction,
  setProvidersByServiceIdAction,
  setAvailabilitiesBySpecialEventBulkAction,
  setBookingDetail,
  setBookingStep,
  registerEventAction,
  resetBooking,
} from 'actionsReducers/booking.actions';
import SelectProvider from './components/SelectProvider';
import BookingDetail from './components/BookingDetail';
import ViewAppointment from './components/ViewAppointment';
import s from './Booking.module.scss';

const STEP_LABELS = ['Select Provider', 'Book Appointment', 'Complete Booking'];

class Booking extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const {
      service,
      serviceProviders,
      providersByServiceIdList,
      availabilitiesBulk,
      bookingStep,
      bookingDetail,
      userDetail,
      loginSession,
      appointmentEvent,
    } = props;
    const {
      service: cachedService,
      serviceProviders: cachedServiceProviders,
      providersByServiceIdList: cachedProvidersByServiceIdList,
      availabilitiesBulk: cachedAvailabilitiesBulk,
      bookingStep: cachedBookingStep,
      bookingDetail: cachedBookingDetail,
      userDetail: cachedUserDetail,
      appointmentEvent: cachedAppointmentEvent,
    } = state;
    if (
      service !== cachedService
      || serviceProviders !== cachedServiceProviders
      || providersByServiceIdList !== cachedProvidersByServiceIdList
      || availabilitiesBulk !== cachedAvailabilitiesBulk
      || bookingStep !== cachedBookingStep
      || bookingDetail !== cachedBookingDetail
      || userDetail !== cachedUserDetail
      || appointmentEvent !== cachedAppointmentEvent
    ) {
      return {
        service,
        serviceProviders,
        providersByServiceIdList,
        availabilitiesBulk,
        bookingStep,
        bookingDetail,
        userDetail,
        loginSession,
        appointmentEvent,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.stepComponents = [SelectProvider, BookingDetail, ViewAppointment];
    this.state = {
      service: null,
      serviceProviders: null,
      providersByServiceIdList: null,
      availabilitiesBulk: null,
      bookingStep: BOOKING.STEPS.SELECT_PROVIDER,
      bookingDetail: null,
      isConfirmDialogOpen: false,
      userDetail: null,
      appointmentEvent: null,
    };
  }

  componentDidMount() {
    const {
      serviceId,
      getServiceByIdAction: getServiceById,
      setServiceProvidersAction: setServiceProviders,
      setProvidersByServiceIdAction: setProvidersByServiceId,
    } = this.props;
    if (serviceId) {
      getServiceById(serviceId);
      setProvidersByServiceId(serviceId);
      setServiceProviders();
    }
  }

  componentDidUpdate = (prevProps) => {
    const {
      serviceProviders,
      appointmentEvent,
      setAvailabilitiesBySpecialEventBulkAction: setAvailabilitiesBySpecialEventBulk,
    } = prevProps;
    const {
      serviceProviders: cachedServiceProviders,
      appointmentEvent: cachedAppointmentEvent,
      setBookingStep: setBookingStepAction,
    } = this.props;
    if (cachedServiceProviders && cachedServiceProviders !== serviceProviders) {
      const specialEventIdList = cachedServiceProviders.map(serviceProvider => ({
        specialEventId: serviceProvider.id,
        customerTimezoneId: moment.tz.guess(),
      }));
      setAvailabilitiesBySpecialEventBulk(specialEventIdList);
    }
    const bookedId = get(appointmentEvent, 'id');
    const cachedId = get(cachedAppointmentEvent, 'id');
    if (bookedId !== cachedId) {
      setBookingStepAction(BOOKING.STEPS.VIEW_BOOKING);
    }
  };

  handleStepChange = dir => () => {
    const {
      setBookingStep: setBookingStepAction,
    } = this.props;
    const {
      bookingStep,
    } = this.state;
    if (bookingStep > BOOKING.STEPS.SELECT_PROVIDER && dir < 0) {
      setBookingStepAction(bookingStep - 1);
    }
    if (bookingStep < BOOKING.STEPS.VIEW_BOOKING && dir > 0) {
      setBookingStepAction(bookingStep + 1);
    }
  };

  goHome = () => {
    const { resetBooking: resetBookingAction } = this.props;
    resetBookingAction();
    history.push('/');
  };

  handleRegisterEvent = () => {
    const {
      registerEventAction: registerEvent,
      serviceId,
    } = this.props;
    const {
      bookingDetail,
      userDetail,
    } = this.state;
    const providerId = get(bookingDetail, 'provider.providerId');
    const duration = get(bookingDetail, 'time.duration');
    const customerId = get(userDetail, 'userSub');
    this.toggleConfirmDialog(false)();
    registerEvent({
      customerId,
      duration,
      slot: {
        customerTimezone: moment.tz.guess(),
        providerId,
        serviceId,
        startSec: bookingDetail.time.start,
      },
      status: 'BOOKING_STATUS_UNSPECIFIED',
      type: 'APPOINTMENT',
    });
  };

  toggleConfirmDialog = isConfirmDialogOpen => () => {
    this.setState({ isConfirmDialogOpen });
  };

  renderChevron = (valid, dir) => {
    const chevronStyle = valid ? 'icon-white icon-big simple-button' : 'icon-transparent icon-big';
    return dir < 0 ? <ChevronLeft className={chevronStyle} />
      : <ChevronRight className={chevronStyle} />;
  };

  // handle select date of provider slots
  handleDateChange = () => {};

  handleMergedProviderInfo = (serviceId, serviceProviders, providersByServiceId) => {
    if (
      serviceId
      && serviceProviders
      && serviceProviders.length
      && providersByServiceId
      && providersByServiceId.length
    ) {
      const providers = [];
      serviceProviders.forEach((serviceProvider) => {
        providersByServiceId.map((providerDetail) => {
          if (serviceProvider.providerId === providerDetail.userSub && serviceProvider.serviceId === serviceId) {
            providers.push({
              ...providerDetail,
              ...serviceProvider,
            });
          }
          return null;
        });
      });
      return uniqBy(providers, item => item.id);
    }
    return null;
  };

  handleProviderAvailableSlots = (availabilitiesBulk, providers) => providers.map((provider) => {
    const availableSlots = [];
    availabilitiesBulk.map((slot) => {
      if (slot.providerId === provider.userSub && slot.serviceId === provider.serviceId) {
        availableSlots.push(slot);
      }
      return null;
    });
    return {
      ...provider,
      availableSlots,
    };
  });

  render() {
    const {
      serviceId,
      setBookingDetail: setBookingDetailAction,
      setBookingStep: setBookingStepAction,
      handleAuth,
      resetBooking: resetBookingAction,
    } = this.props;
    const {
      service,
      serviceProviders,
      providersByServiceIdList,
      availabilitiesBulk,
      bookingStep,
      bookingDetail,
      isConfirmDialogOpen,
      appointmentEvent,
    } = this.state;
    const Step = this.stepComponents[bookingStep];
    const isBackValid = bookingStep === BOOKING.STEPS.CONFIRM_BOOKING;
    const isNextValid = bookingStep < BOOKING.STEPS.CONFIRM_BOOKING && bookingDetail;
    const providers = this.handleMergedProviderInfo(
      serviceId,
      serviceProviders,
      providersByServiceIdList,
    );
    const providersWithSlot = availabilitiesBulk && this.handleProviderAvailableSlots(availabilitiesBulk, providers);
    const stepProps = {
      [BOOKING.STEPS.SELECT_PROVIDER]: {
        bookingService: service,
        providers: providersWithSlot,
        onDateChange: this.handleDateChange,
        setBookingDetail: setBookingDetailAction,
        setBookingStep: setBookingStepAction,
      },
      [BOOKING.STEPS.CONFIRM_BOOKING]: {
        bookingService: service,
        handleAuth,
        handleConfirmDialog: this.toggleConfirmDialog(true),
      },
      [BOOKING.STEPS.VIEW_BOOKING]: {
        bookingService: service,
        appointmentEvent,
        resetBooking: resetBookingAction,
      },
    };

    return (
      <>
        <Error />
        <Loading />
        {bookingDetail && bookingDetail.provider && (
          <CustomModal
            type="info"
            title="Booking confirmation"
            message="Do you want to book the event?"
            isOpen={isConfirmDialogOpen}
            onClose={this.toggleConfirmDialog(false)}
            okCallBack={this.handleRegisterEvent}
            cancelCallBack={this.toggleConfirmDialog(false)}
          />
        )}
        <div>
          <div className={`${s.navBar} h-space-btw`}>
            <div className="brand-logo">
              <Avatar classes={{ img: s.logoImage }} src={logo} alt="Quezone Logo" className="brand-logo" />
            </div>
            <div className={s.bookingStepsWrapper}>
              <Button disabled={!isBackValid} onClick={this.handleStepChange(-1)} className="simple-button">
                {this.renderChevron(isBackValid, -1)}
              </Button>
              <div className={s.stepper}>
                <div className={s.step}>
                  <div className={s.stepNumber}>
                    <Typography variant="title" color="inherit">
                      {bookingStep + 1}
                    </Typography>
                  </div>
                  <div className={s.stepLabel}>
                    <Typography variant="title" className="gallery-color">
                      {STEP_LABELS[bookingStep]}
                    </Typography>
                  </div>
                </div>
              </div>
              <Button disabled={!isNextValid} onClick={this.handleStepChange(1)} className="simple-button">
                {this.renderChevron(isNextValid, 1)}
              </Button>
            </div>
            <div className={s.goBack}>
              <IconButton color="inherit" onClick={this.goHome} aria-label="Close">
                <Home />
              </IconButton>
            </div>
          </div>
          <Step
            {...stepProps[bookingStep]}
          />
        </div>
      </>
    );
  }
}

Booking.propTypes = {
  serviceId: string.isRequired,
  bookingStep: number.isRequired,
  getServiceByIdAction: func.isRequired,
  setServiceProvidersAction: func.isRequired,
  setProvidersByServiceIdAction: func.isRequired,
  setAvailabilitiesBySpecialEventBulkAction: func.isRequired,
  setBookingDetail: func.isRequired,
  setBookingStep: func.isRequired,
  registerEventAction: func.isRequired,
  handleAuth: func.isRequired,
  userDetail: userDetailType.isRequired,
  resetBooking: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.auth,
  ...state.common,
  ...state.home,
  ...state.booking,
});

export default compose(
  connect(
    mapStateToProps,
    {
      getServiceByIdAction,
      setServiceProvidersAction,
      setProvidersByServiceIdAction,
      setAvailabilitiesBySpecialEventBulkAction,
      setBookingDetail,
      setBookingStep,
      registerEventAction,
      resetBooking,
    },
  ),
)(Booking);
