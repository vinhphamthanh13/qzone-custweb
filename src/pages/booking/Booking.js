import React, { PureComponent } from 'react';
import {
  bool,
  string,
  func,
  number,
  objectOf,
  any,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import {
  get,
  uniqBy,
  compact,
} from 'lodash';
import {
  IconButton,
  Avatar,
  Button,
  Typography,
} from '@material-ui/core';
import {
  Home,
  AccountBox,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
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
import {
  setServiceProvidersAction,
  setError,
} from 'actionsReducers/common.actions';
import {
  getServiceByIdAction,
  setProvidersByServiceIdAction,
  setAvailabilitiesBySpecialEventBulkAction,
  setBookingDetail,
  setBookingStep,
  registerEventAction,
  resetBooking,
  setTemporaryServicesByIdAction,
  setAvailabilitiesByIdAction,
} from 'actionsReducers/booking.actions';
import {
  setWaitListsByIdAction,
  resetRegisterWaitListStatus,
} from 'actionsReducers/waitlist.actions';
import SelectProvider from './components/SelectProvider';
import BookingDetail from './components/BookingDetail';
import ViewAppointment from './components/ViewAppointment';
import s from './Booking.module.scss';

const STEP_LABELS = ['Select A Provider', 'Book Appointment', 'Complete Booking'];

class Booking extends PureComponent {
  static propTypes = {
    showPage: bool, // Showing this booking in Home or Booking flow
    serviceId: string,
    temporaryServiceId: string,
    bookingStep: number.isRequired,
    getServiceByIdAction: func.isRequired,
    setServiceProvidersAction: func.isRequired,
    setProvidersByServiceIdAction: func.isRequired,
    setAvailabilitiesBySpecialEventBulkAction: func.isRequired,
    setAvailabilitiesByIdAction: func.isRequired,
    setBookingDetail: func.isRequired,
    setBookingStep: func.isRequired,
    registerEventAction: func.isRequired,
    handleAuth: func.isRequired,
    resetBooking: func.isRequired,
    setTemporaryServicesByIdAction: func.isRequired,
    waitListsById: objectOf(any),
    setError: func.isRequired,
    resetRegisterWaitListStatus: func.isRequired,
  };

  static defaultProps = {
    serviceId: null,
    temporaryServiceId: null,
    waitListsById: null,
    showPage: false,
  };

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
      waitListId,
      waitListsById,
      availabilitiesById,
      setBookingDetail: setBookingDetailAction,
      setBookingStep: setBookingStepAction,
      waitListRegistered,
      temporaryServicesByLocation,
      bookedEventIdList,
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
      waitListId: cachedWaitListId,
      waitListsById: cachedWaitListsById,
      availabilitiesById: cachedAvailabilitiesById,
      waitListRegistered: cachedWaitListRegistered,
      temporaryServicesByLocation: cachedTemporaryServiceByLocation,
      bookedEventIdList: cachedBookedEventIdList,
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
      || waitListId !== cachedWaitListId
      || waitListsById !== cachedWaitListsById
      || availabilitiesById !== cachedAvailabilitiesById
      || waitListRegistered !== cachedWaitListRegistered
      || temporaryServicesByLocation !== cachedTemporaryServiceByLocation
      || bookedEventIdList.length !== cachedBookedEventIdList.length
    ) {
      let availabilityId = null;
      let waitListStatus = '';
      let resolvedServiceId = serviceId;
      let resolvedTemporaryServiceId = temporaryServiceId;
      const customerId = get(userDetail, 'userSub') || get(userDetail, 'id');

      if (resolvedTemporaryServiceId && serviceProviders && serviceProviders.length > 0) {
        resolvedServiceId = resolvedServiceId || get(serviceProviders, '0.serviceId');
      }

      if (waitListsById) {
        resolvedTemporaryServiceId = resolvedTemporaryServiceId || get(waitListsById, 'tempServiceId');
        waitListStatus = get(waitListsById, 'status');
        availabilityId = get(waitListsById, 'availabilityId');
      }

      if (availabilitiesById) {
        resolvedServiceId = resolvedServiceId || get(availabilitiesById, 'serviceId');
        const duration = get(availabilitiesById, 'durationSec');
        const waitListTemporaryServiceId = get(availabilitiesById, 'specialServiceId'); // TODO change the path name
        const providerStartSec = get(availabilitiesById, 'providerStartSec');
        const startSec = moment(providerStartSec.replace(' ', 'T')).unix();
        const providerId = get(availabilitiesById, 'providerId');
        let provider = {};
        let providerDetail = {};
        if (providersByServiceIdList && providersByServiceIdList.length) {
          provider = providersByServiceIdList.find(item => item.userSub === providerId);
        }
        if (serviceProviders && serviceProviders.length) {
          providerDetail = serviceProviders.find(item => item.id === waitListTemporaryServiceId);
        }
        const postProvider = {
          ...provider,
          ...providerDetail,
        };
        const time = {
          availabilityId,
          duration,
          start: startSec,
        };
        if (
          bookingStep === 0
          && postProvider.userSub
          && postProvider.geoLocation
          && waitListId
          && availabilityId
        ) {
          setBookingDetailAction({
            provider: postProvider,
            time,
          });
          setBookingStepAction(BOOKING.STEPS.CONFIRM_BOOKING);
        }
      }

      if (providersByServiceIdList && providersByServiceIdList.length === 0) {
        history.push('/');
      }

      return {
        serviceId: resolvedServiceId,
        temporaryServiceId: resolvedTemporaryServiceId,
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
        waitListId,
        waitListsById,
        availabilitiesById,
        waitListStatus,
        waitListRegistered,
        temporaryServicesByLocation,
        bookedEventIdList,
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
      waitListId: null,
      temporaryServicesByLocation: null,
      bookedEventIdList: [],
    };
    this.myBooking = React.createRef();
  }

  componentDidMount() {
    const {
      serviceId,
      temporaryServiceId,
      getServiceByIdAction: getServiceById,
      setProvidersByServiceIdAction: setProvidersByServiceId,
      setTemporaryServicesByIdAction: setTemporaryServicesById,
      setWaitListsByIdAction: setWaitListsById,
      waitListId,
      setServiceProvidersAction: setServiceProviders,
    } = this.props;
    if (serviceId) {
      getServiceById(serviceId);
      setProvidersByServiceId(serviceId);
      setServiceProviders();
    }
    if (temporaryServiceId) {
      setTemporaryServicesById(temporaryServiceId);
    }
    if (waitListId) {
      setWaitListsById(waitListId);
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      isError,
      errorMessage,
      serviceProviders,
      appointmentEvent,
      setAvailabilitiesBySpecialEventBulkAction: setAvailabilitiesBySpecialEventBulk,
      waitListsById,
      // availabilityId,
      waitListRegistered,
      bookedEventIdList,
    } = prevProps;
    const {
      isError: cachedIsError,
      errorMessage: cachedErrorMessage,
      serviceProviders: cachedServiceProviders,
      appointmentEvent: cachedAppointmentEvent,
      setBookingStep: setBookingStepAction,
      getServiceByIdAction: getServiceById,
      setProvidersByServiceIdAction: setProvidersByServiceId,
      waitListsById: cachedWaitListsById,
      setAvailabilitiesByIdAction: setAvailabilitiesById,
      setServiceProvidersAction: setServiceProviders,
      waitListRegistered: cachedWaitListRegistered,
      setError: setErrorAction,
    } = this.props;
    const {
      serviceId,
    } = prevState;
    const {
      serviceId: cachedServiceId,
      bookedEventIdList: cachedBookedEventIdList,
    } = this.state;

    const bookedId = get(appointmentEvent, 'id');
    const cachedId = get(cachedAppointmentEvent, 'id');

    const availabilityId = get(waitListsById, 'availabilityId');
    const cachedAvailabilityId = get(cachedWaitListsById, 'availabilityId');
    if (availabilityId !== cachedAvailabilityId) {
      setAvailabilitiesById(cachedAvailabilityId);
    }

    if (
      (cachedServiceProviders && cachedServiceProviders !== serviceProviders)
      || bookedEventIdList.length !== cachedBookedEventIdList.length) {
      const specialEventIdList = cachedServiceProviders.map(serviceProvider => ({
        specialEventId: serviceProvider.id,
        customerTimezoneId: serviceProvider.timezoneId,
      }));
      setAvailabilitiesBySpecialEventBulk(specialEventIdList);
    }

    if (serviceId !== cachedServiceId) {
      getServiceById(cachedServiceId);
      setProvidersByServiceId(cachedServiceId);
      setServiceProviders();
    }

    if (bookedId !== cachedId) {
      setBookingStepAction(BOOKING.STEPS.VIEW_BOOKING);
    }

    if (
      isError !== cachedIsError
      && errorMessage !== cachedErrorMessage
      && regExPattern.connectError.test(cachedErrorMessage)) {
      history.push('/');
    }

    if (cachedWaitListRegistered && cachedWaitListRegistered !== waitListRegistered) {
      setErrorAction(cachedWaitListRegistered);
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
    const {
      customerId,
      waitListId,
    } = this.state;
    if (!waitListId) {
      this.handleResetBooking();
    }
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
    const customerId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const startSec = get(bookingDetail, 'time.start');
    this.toggleConfirmDialog(false)();
    registerEvent({
      customerId,
      duration,
      availabilityId,
      startSec,
      status: 'UNSPECIFIED',
      type: 'APPOINTMENT',
    });
  };

  toggleConfirmDialog = isConfirmDialogOpen => () => {
    this.setState({ isConfirmDialogOpen });
  };

  // handle select date of provider slots
  handleDateChange = () => {};

  handleMergedProviderInfo = (serviceId, serviceProviders, providersByServiceId, temporaryServicesByLocation) => {
    if (
      serviceId
      && temporaryServicesByLocation
      && Object.keys(temporaryServicesByLocation).length
      && providersByServiceId
      && providersByServiceId.length
    ) {
      const locationProviders = [];
      Object.keys(temporaryServicesByLocation).map((locationId) => {
        uniqBy(compact(providersByServiceId), provider => provider.userSub).forEach((provider) => {
          const temporaryServiceIds = [];
          let uniqProvider = {};
          temporaryServicesByLocation[locationId].map((tempService) => {
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
          if (uniqProvider.id) {
            uniqProvider.temporaryServiceIds = temporaryServiceIds;
            locationProviders.push(uniqProvider);
          }
        });
        return null;
      });
      return locationProviders;
    }
    return null;
  };

  handleProviderAvailableSlots = (availabilitiesBulk, providers) => providers.map((provider) => {
    const availableSlots = [];
    availabilitiesBulk.map((slot) => {
      const locationId = get(provider, 'geoLocation.id');
      if (
        slot.providerId === provider.userSub
        && slot.serviceId === provider.serviceId
        && slot.locationId === locationId) {
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
    const chevronStyle = valid ? 'icon-main icon-big simple-button' : 'icon-disabled icon-big';
    return dir < 0 ? <ChevronLeft className={chevronStyle} />
      : <ChevronRight className={chevronStyle} />;
  };

  renderSteppers = (isBackValid, isNextValid) => (
    <>
      <Button
        disabled={!isBackValid}
        onClick={this.handleStepChange(-1)}
        className="simple-button"
      >
        {this.renderChevron(isBackValid, -1)}
      </Button>
      <div className={s.stepsWrapper}>
        {
          STEP_LABELS.map((step, index) => {
            const { bookingStep } = this.state;
            const [numberStyle, labelStyle] = bookingStep >= index
              ? [`${s.stepNumber} ${s.stepNumberActive}`, `${s.stepLabel} ${s.stepLabelActive}`]
              : [s.stepNumber, s.stepLabel];
            return (
              <div key={uuidv1()} className={s.step}>
                <div className={numberStyle}>
                  <Typography variant="body1" color="inherit">
                    {index + 1}
                  </Typography>
                </div>
                <div className={labelStyle}>
                  <Typography variant="body1" color="inherit" className="text-bold">
                    {step}
                  </Typography>
                </div>
              </div>
            );
          })
        }
      </div>
      <Button disabled={!isNextValid} onClick={this.handleStepChange(1)} className="simple-button">
        {this.renderChevron(isNextValid, 1)}
      </Button>
    </>);

  handleResetWaitListStatus = () => {
    const { resetRegisterWaitListStatus: resetRegisterWaitListStatusAction } = this.props;
    resetRegisterWaitListStatusAction();
  };

  scrollToMyBooking = () => {
    window.scrollTo(0, this.myBooking.current.offsetTop);
  };

  render() {
    const {
      setBookingDetail: setBookingDetailAction,
      setBookingStep: setBookingStepAction,
      handleAuth,
      resetBooking: resetBookingAction,
      showPage,
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
      waitListId,
      customerId,
      temporaryServicesByLocation,
    } = this.state;

    const Step = this.stepComponents[bookingStep];
    const isBackValid = bookingStep === BOOKING.STEPS.CONFIRM_BOOKING && !waitListId;
    const isNextValid = bookingStep < BOOKING.STEPS.CONFIRM_BOOKING && bookingDetail;
    const isProfile = customerId && bookingStep !== BOOKING.STEPS.CONFIRM_BOOKING;
    const isShowLogin = !customerId && bookingStep === BOOKING.STEPS.SELECT_PROVIDER;
    const providers = this.handleMergedProviderInfo(
      serviceId,
      serviceProviders,
      providersByServiceIdList,
      temporaryServicesByLocation,
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
        showPage,
        scrollBooking: this.scrollToMyBooking,
      },
      [BOOKING.STEPS.CONFIRM_BOOKING]: {
        bookingService: service,
        handleConfirmDialog: this.toggleConfirmDialog(true),
        showPage,
      },
      [BOOKING.STEPS.VIEW_BOOKING]: {
        bookingService: service,
        appointmentEvent,
        resetBooking: resetBookingAction,
        showPage,
      },
    };

    return (
      <>
        <Success />
        <Error resetOtherStatus={this.handleResetWaitListStatus} />
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
            isBackDropClickDisabled
          />
        )}
        <div ref={this.myBooking} className="full-width">
          {showPage && (
            <div className={s.bookingInstant}>
              <div className={`${s.navBar} h-space-btw`}>
                <div className="brand-logo">
                  <Avatar classes={{ img: s.logoImage }} src={logo} alt="Quezone Logo" className="brand-logo" />
                </div>
                <div className={s.goBack}>
                  {isProfile && (
                    <IconButton color="inherit" onClick={this.goProfile}>
                      <AccountBox />
                    </IconButton>)}
                  {isShowLogin && (
                    <IconButton color="inherit" onClick={() => handleAuth('isLoginOpen')}>
                      <Fingerprint />
                    </IconButton>
                  )}
                  <IconButton color="inherit" onClick={this.goHome} aria-label="Close">
                    <Home />
                  </IconButton>
                </div>
              </div>
              <div className={s.bookingStepsWrapperPage}>
                <div className={s.stepper}>
                  {this.renderSteppers(isBackValid, isNextValid)}
                </div>
              </div>
            </div>
          )}
          {!showPage && (
            <div className={s.stepper}>
              {this.renderSteppers(isBackValid, isNextValid)}
            </div>
          )}
          <Step
            {...stepProps[bookingStep]}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.common,
  ...state.auth,
  ...state.home,
  ...state.booking,
  ...state.waitLists,
});

export default compose(
  connect(
    mapStateToProps,
    {
      getServiceByIdAction,
      setServiceProvidersAction,
      setProvidersByServiceIdAction,
      setAvailabilitiesBySpecialEventBulkAction,
      setAvailabilitiesByIdAction,
      setBookingDetail,
      setBookingStep,
      registerEventAction,
      resetBooking,
      setTemporaryServicesByIdAction,
      setWaitListsByIdAction,
      setError,
      resetRegisterWaitListStatus,
    },
  ),
)(Booking);
