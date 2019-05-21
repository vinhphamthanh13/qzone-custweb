import React, { PureComponent } from 'react';
import {
  string,
  func,
  number,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment-timezone';
import {
  get,
  uniqBy,
} from 'lodash';
import {
  IconButton,
  Avatar,
  Button,
  Typography,
} from '@material-ui/core';
import {
  Home,
  AssignmentInd,
  ChevronLeft,
  ChevronRight,
} from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import logo from 'images/quezone-logo.png';
import CustomModal from 'components/Modal/CustomModal';
import Loading from 'components/Loading';
import Error from 'components/Error';
import { history } from 'containers/App';
import Success from 'components/Success';
import {
  BOOKING,
  regExPattern,
} from 'utils/constants';
import { setServiceProvidersAction } from 'actionsReducers/common.actions';
import {
  getServiceByIdAction,
  setProvidersByServiceIdAction,
  setAvailabilitiesBySpecialEventBulkAction,
  setBookingDetail,
  setBookingStep,
  registerEventAction,
  resetBooking,
  setTemporaryServicesByIdAction,
} from 'actionsReducers/booking.actions';
import SelectProvider from './components/SelectProvider';
import BookingDetail from './components/BookingDetail';
import ViewAppointment from './components/ViewAppointment';
import s from './Booking.module.scss';

const STEP_LABELS = ['Select Provider', 'Book Appointment', 'Complete Booking'];

class Booking extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const {
      serviceId,
      temporaryServiceId,
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
      serviceId: cachedServiceId,
      temporaryServiceId: cachedTemporaryServiceId,
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
      serviceId !== cachedServiceId
      || temporaryServiceId !== cachedTemporaryServiceId
      || service !== cachedService
      || serviceProviders !== cachedServiceProviders
      || providersByServiceIdList !== cachedProvidersByServiceIdList
      || availabilitiesBulk !== cachedAvailabilitiesBulk
      || bookingStep !== cachedBookingStep
      || bookingDetail !== cachedBookingDetail
      || userDetail !== cachedUserDetail
      || appointmentEvent !== cachedAppointmentEvent
    ) {
      let resolvedServiceId = serviceId;
      if (temporaryServiceId && serviceProviders && serviceProviders.length === 1) {
        resolvedServiceId = resolvedServiceId || get(serviceProviders, '0.serviceId');
      }
      if (providersByServiceIdList && providersByServiceIdList.length === 0) {
        history.push('/');
      }
      const customerId = get(userDetail, 'userSub');

      return {
        serviceId: resolvedServiceId,
        temporaryServiceId,
        service,
        serviceProviders,
        providersByServiceIdList,
        availabilitiesBulk,
        bookingStep,
        bookingDetail,
        userDetail,
        loginSession,
        appointmentEvent,
        customerId,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.stepComponents = [SelectProvider, BookingDetail, ViewAppointment];
    this.state = {
      serviceId: null,
      service: null,
      serviceProviders: null,
      providersByServiceIdList: null,
      availabilitiesBulk: null,
      bookingStep: BOOKING.STEPS.SELECT_PROVIDER,
      bookingDetail: null,
      isConfirmDialogOpen: false,
      userDetail: null,
      appointmentEvent: null,
      customerId: null,
    };
  }

  componentDidMount() {
    const {
      serviceId,
      temporaryServiceId,
      getServiceByIdAction: getServiceById,
      setServiceProvidersAction: setServiceProviders,
      setProvidersByServiceIdAction: setProvidersByServiceId,
      setTemporaryServicesByIdAction: setTemporaryServicesById,
    } = this.props;
    console.log('component didmount', serviceId);
    if (serviceId) {
      console.log('should fetch the provider service', serviceId);
      getServiceById(serviceId);
      setProvidersByServiceId(serviceId);
      setServiceProviders();
    }
    if (temporaryServiceId) {
      setTemporaryServicesById(temporaryServiceId);
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      isError,
      errorMessage,
      serviceProviders,
      appointmentEvent,
      setAvailabilitiesBySpecialEventBulkAction: setAvailabilitiesBySpecialEventBulk,
    } = prevProps;
    const {
      isError: cachedIsError,
      errorMessage: cachedErrorMessage,
      serviceProviders: cachedServiceProviders,
      appointmentEvent: cachedAppointmentEvent,
      setBookingStep: setBookingStepAction,
      getServiceByIdAction: getServiceById,
      setProvidersByServiceIdAction: setProvidersByServiceId,
    } = this.props;
    const {
      serviceId: cachedServiceId,
    } = prevState;
    const {
      serviceId,
    } = this.state;
    if (cachedServiceProviders && cachedServiceProviders !== serviceProviders) {
      const specialEventIdList = cachedServiceProviders.map(serviceProvider => ({
        specialEventId: serviceProvider.id,
        customerTimezoneId: moment.tz.guess(),
      }));
      setAvailabilitiesBySpecialEventBulk(specialEventIdList);
    }
    if (serviceId !== cachedServiceId) {
      getServiceById(serviceId);
      setProvidersByServiceId(serviceId);
    }
    const bookedId = get(appointmentEvent, 'id');
    const cachedId = get(cachedAppointmentEvent, 'id');
    if (bookedId !== cachedId) {
      setBookingStepAction(BOOKING.STEPS.VIEW_BOOKING);
    }
    if (
      isError !== cachedIsError
      && errorMessage !== cachedErrorMessage
      && regExPattern.connectError.test(cachedErrorMessage)) {
      history.push('/');
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

  handleResetBooking = () => {
    const { resetBooking: resetBookingAction } = this.props;
    resetBookingAction();
  };

  goHome = () => {
    this.handleResetBooking();
    history.push('/');
  };

  goProfile = () => {
    const { customerId } = this.state;
    this.handleResetBooking();
    history.push(`/profile/${customerId}`);
  };

  handleRegisterEvent = () => {
    const {
      registerEventAction: registerEvent,
    } = this.props;
    const {
      bookingDetail,
      userDetail,
    } = this.state;
    const availabilityId = get(bookingDetail, 'time.availabilityId');
    const duration = get(bookingDetail, 'time.duration');
    const customerId = get(userDetail, 'userSub');
    const startSec = get(bookingDetail, 'time.start');
    this.toggleConfirmDialog(false)();
    registerEvent({
      customerId,
      duration,
      availabilityId,
      startSec,
      status: 'BOOKING_STATUS_UNSPECIFIED',
      type: 'APPOINTMENT',
    });
  };

  toggleConfirmDialog = isConfirmDialogOpen => () => {
    this.setState({ isConfirmDialogOpen });
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
      console.log('provider by service ID', providersByServiceId);
      uniqBy(providersByServiceId, provider => provider.id).forEach((provider) => {
        const temporaryServiceIds = [];
        let uniqProvider = {};
        serviceProviders.map((tempService) => {
          if (tempService.providerId === provider.userSub && tempService.serviceId === serviceId) {
            temporaryServiceIds.push(tempService.id);
            uniqProvider = {
              ...uniqProvider,
              ...provider,
              ...tempService,
            };
          }
          return null;
        });
        uniqProvider.temporaryServiceIds = temporaryServiceIds;
        providers.push(uniqProvider);
      });
      return providers;
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

  renderChevron = (valid, dir) => {
    const chevronStyle = valid ? 'icon-white icon-big simple-button' : 'icon-disabled icon-big';
    return dir < 0 ? <ChevronLeft className={chevronStyle} />
      : <ChevronRight className={chevronStyle} />;
  };

  renderSteppers = () => STEP_LABELS.map((step, index) => {
    const { bookingStep } = this.state;
    const [numberStyle, labelStyle] = bookingStep >= index
      ? [`${s.stepNumber} ${s.stepNumberActive}`, `${s.stepLabel} ${s.stepLabelActive}`]
      : [s.stepNumber, s.stepLabel];
    return (
      <div key={uuidv1()} className={s.step}>
        <div className={numberStyle}>
          <Typography variant="subheading" color="inherit">
            {index + 1}
          </Typography>
        </div>
        <div className={labelStyle}>
          <Typography variant="subheading" color="inherit" className="text-bold">
            {step}
          </Typography>
        </div>
      </div>
    );
  });

  render() {
    const {
      setBookingDetail: setBookingDetailAction,
      setBookingStep: setBookingStepAction,
      handleAuth,
      resetBooking: resetBookingAction,
    } = this.props;
    const {
      serviceId,
      service,
      serviceProviders,
      providersByServiceIdList,
      availabilitiesBulk,
      bookingStep,
      bookingDetail,
      isConfirmDialogOpen,
      appointmentEvent,
      customerId,
    } = this.state;

    const Step = this.stepComponents[bookingStep];
    const isBackValid = bookingStep === BOOKING.STEPS.CONFIRM_BOOKING;
    const isNextValid = bookingStep < BOOKING.STEPS.CONFIRM_BOOKING && bookingDetail;
    const providers = this.handleMergedProviderInfo(
      serviceId,
      serviceProviders,
      providersByServiceIdList,
    );
    const providersWithSlot = availabilitiesBulk && providers
      && this.handleProviderAvailableSlots(availabilitiesBulk, providers);
    const stepProps = {
      [BOOKING.STEPS.SELECT_PROVIDER]: {
        bookingService: service,
        providers: providersWithSlot,
        onDateChange: this.handleDateChange,
        setBookingDetail: setBookingDetailAction,
        setBookingStep: setBookingStepAction,
        handleAuth,
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
        <Success />
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
                {this.renderSteppers()}
              </div>
              <Button disabled={!isNextValid} onClick={this.handleStepChange(1)} className="simple-button">
                {this.renderChevron(isNextValid, 1)}
              </Button>
            </div>
            <div className={s.goBack}>
              {customerId && (
                <IconButton color="inherit" onClick={this.goProfile} aria-label="Profile">
                  <AssignmentInd />
                </IconButton>
              )}
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
  serviceId: string,
  temporaryServiceId: string,
  bookingStep: number.isRequired,
  getServiceByIdAction: func.isRequired,
  setServiceProvidersAction: func.isRequired,
  setProvidersByServiceIdAction: func.isRequired,
  setAvailabilitiesBySpecialEventBulkAction: func.isRequired,
  setBookingDetail: func.isRequired,
  setBookingStep: func.isRequired,
  registerEventAction: func.isRequired,
  handleAuth: func.isRequired,
  resetBooking: func.isRequired,
  setTemporaryServicesByIdAction: func.isRequired,
};

Booking.defaultProps = {
  serviceId: null,
  temporaryServiceId: null,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.auth,
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
      setTemporaryServicesByIdAction,
    },
  ),
)(Booking);
