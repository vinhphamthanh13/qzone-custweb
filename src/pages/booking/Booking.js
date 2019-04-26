import React, { PureComponent } from 'react';
import {
  string,
  func,
  shape,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import {
  get,
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
import { history } from 'containers/App';
import { findEventByCustomerIdAction } from 'actionsReducers/common.actions';
import { setServiceProvidersAction } from 'actionsReducers/home.actions';
import {
  getServiceByIdAction,
  setProvidersByServiceIdAction,
  setAvailabilitiesBySpecialEventBulkAction,
} from 'actionsReducers/booking.actions';

import { setProviders } from 'reduxModules/home/bookingDialog/selectProvider.actions';
import { bookEvent, resetStatus } from 'reduxModules/home/bookingDialog.actions';
import { toggleAppointment } from 'reduxModules/appointments.actions';
import SelectProvider from './components/SelectProvider';
import BookingDetail from './components/BookingDetail';
import ViewAppointment from './components/ViewAppointment';
import s from './Booking.module.scss';

const STEP_LABELS = ['Select provider', 'Book appointment', 'Complete booking'];

class Booking extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const {
      service,
      serviceProviders,
      providersByServiceIdList,
      availabilitiesBulk,
    } = props;
    const {
      service: cachedService,
      serviceProviders: cachedServiceProviders,
      providersByServiceIdList: cachedProvidersByServiceIdList,
      availabilitiesBulk: cachedAvailabilitiesBulk,
    } = state;

    if (service !== cachedService) {
      return {
        service,
      };
    }
    if (serviceProviders !== cachedServiceProviders) {
      return {
        serviceProviders,
      };
    }
    if (providersByServiceIdList !== cachedProvidersByServiceIdList) {
      return {
        providersByServiceIdList,
      };
    }
    if (availabilitiesBulk !== cachedAvailabilitiesBulk) {
      return {
        availabilitiesBulk,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.stepComponents = [SelectProvider, BookingDetail, ViewAppointment];
    this.defaultState = {
      service: null,
      serviceProviders: null,
      providersByServiceIdList: null,
      availabilitiesBulk: null,
      step: 0,
      bookingDetail: {
        provider: undefined,
        time: undefined,
      },
      isConfirmDialogOpen: false,
    };
    this.state = { ...this.defaultState };
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
      setAvailabilitiesBySpecialEventBulkAction: setAvailabilitiesBySpecialEventBulk,
    } = prevProps;
    const { serviceProviders: cachedServiceProviders } = this.props;
    if (cachedServiceProviders && cachedServiceProviders !== serviceProviders) {
      const specialEventIdList = cachedServiceProviders.map(serviceProvider => ({
        specialEventId: serviceProvider.id,
        customerTimezoneId: moment.tz.guess(),
      }));
      setAvailabilitiesBySpecialEventBulk(specialEventIdList);
    }
    if (prevProps.bookingStatus.type === '' && this.props.bookingStatus.type === 'success') {
      this.handleNext();
    }
  };

  onStepChange = idx => () => {
    this.setState({ step: idx });
  };

  handleBack = () => {
    this.setState(oldState => ({ step: oldState.step - 1 }));
  };

  handleNext = () => {
    this.setState(oldState => ({ step: oldState.step + 1 }));
  };

  isStepCompleted = () => {
    const { step, bookingDetail } = this.state;
    switch (step) {
      case 0:
        return !!bookingDetail.provider && !!bookingDetail.time;
      default:
        return false;
    }
  };

  onChangeBookingDetail = (value, key, cb) => {
    this.setState(oldState => ({
      bookingDetail: {
        ...oldState.bookingDetail,
        [key]: value,
      },
    }), cb);
  };

  handleClose = () => {
    const { resetStatusAction, setProvidersAction } = this.props;
    setProvidersAction([]);
    resetStatusAction();
    this.setState(this.defaultState);
    history.push('/');
  };

  onSaveBooking = () => {
    const { userDetail, bookEventAction, serviceId } = this.props;
    const { bookingDetail } = this.state;
    const providerId = get(bookingDetail, 'provider.providerId');
    const duration = get(bookingDetail, 'time.duration');
    const customerId = get(userDetail, 'userSub');
    this.toggleConfirmDialog(false)();
    bookEventAction({
      customerId,
      duration,
      slot: {
        customerTimezone: moment.tz.guess(),
        providerId,
        serviceId,
        startSec: bookingDetail.time.start / 1000,
      },
      status: 'BOOKING_STATUS_UNSPECIFIED',
      type: 'APPOINTMENT',
    });
  };

  closeErrorModal = () => {
    this.handleBack();
    this.props.resetStatusAction();
  };

  openAppointmentDialog = () => {
    this.props.toggleAppointmentAction(true);
  };

  toggleConfirmDialog = isConfirmDialogOpen => () => {
    this.setState({ isConfirmDialogOpen });
  };

  handleViewAppointment = () => {
    const {
      handleOpenProfile,
      findEventByCustomerIdAction: findEventByCustomerId,
      userDetail: { userSub },
      resetStatusAction,
    } = this.props;
    findEventByCustomerId(userSub);
    handleOpenProfile();
    resetStatusAction();
  };

  renderChevron = (valid, direction) => {
    const chevronStyle = valid ? 'icon-white icon-big icon-shake' : 'icon-transparent icon-big';
    return direction === 'left' ? <ChevronLeft className={chevronStyle} />
      : <ChevronRight className={chevronStyle} />;
  };

  handleDateChange = () => {
    console.log('handleDateChange');
  };

  handleMergedProviderInfo = (serviceId, serviceProviders, providersByServiceId) => {
    if (
      serviceId
      && serviceProviders
      && serviceProviders.length
      && providersByServiceId
      && providersByServiceId.length
    ) {
      const providers = [];
      providersByServiceId.forEach((providerDetail) => {
        serviceProviders.map((serviceProvider) => {
          if (serviceProvider.providerId === providerDetail.userSub && serviceProvider.serviceId === serviceId) {
            providers.push({
              ...serviceProvider,
              ...providerDetail,
            });
          }
          return null;
        });
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

  render() {
    const {
      serviceId,
      bookingStatus,
      // userDetail,
      // bookingEvent,
      // openDialog,
    } = this.props;
    const {
      service,
      serviceProviders,
      providersByServiceIdList,
      availabilitiesBulk,
      step,
      bookingDetail,
      isConfirmDialogOpen,
    } = this.state;
    const Step = this.stepComponents[step];
    const isBackValid = !(step === 0 || step === STEP_LABELS.length - 1);
    const isNextValid = !(step === STEP_LABELS.length - 1 || !this.isStepCompleted());
    const providers = this.handleMergedProviderInfo(
      serviceId,
      serviceProviders,
      providersByServiceIdList,
    );
    const providersWithSlot = availabilitiesBulk && this.handleProviderAvailableSlots(availabilitiesBulk, providers);
    const stepProps = {
      0: {
        bookingService: service,
        providers: providersWithSlot,
        onDateChange: this.handleDateChange,
      },
    };

    return (
      <>
        <Loading />
        <CustomModal
          type={bookingStatus.type}
          title="Booking failed"
          message={bookingStatus.message}
          isOpen={bookingStatus.type === 'error'}
          onClose={this.closeErrorModal}
        />
        {bookingDetail.provider && (
          <CustomModal
            type="info"
            title="Booking confirmation"
            message="Do you want to book the event?"
            isOpen={isConfirmDialogOpen}
            onClose={this.toggleConfirmDialog(false)}
            okCallBack={this.onSaveBooking}
            cancelCallBack={this.toggleConfirmDialog(false)}
          />
        )}
        <div>
          <div className={`${s.navBar} h-space-btw`}>
            <div className="brand-logo">
              <Avatar classes={{ img: s.logoImage }} src={logo} alt="Quezone Logo" className="brand-logo" />
            </div>
            <div>
              <div className={s.bookingStepsWrapper}>
                <Button disabled={!isBackValid} onClick={this.handleBack} className="simple-button">
                  {this.renderChevron(isBackValid, 'left')}
                </Button>
                <div className={s.stepper}>
                  <div className={s.step}>
                    <div className={s.stepNumber}>
                      <Typography variant="subtitle1" color="inherit">
                        {step + 1}
                      </Typography>
                    </div>
                    <div className={s.stepLabel}>
                      <Typography variant="subtitle1" color="inherit">
                        {STEP_LABELS[step]}
                      </Typography>
                    </div>
                  </div>
                </div>
                <Button disabled={!isNextValid} onClick={this.handleNext} className="simple-button">
                  {this.renderChevron(isNextValid, 'right')}
                </Button>
              </div>
            </div>
            <div className={s.goBack}>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <Home />
              </IconButton>
            </div>
          </div>
          <Step
            {...stepProps[step]}
          />
        </div>
      </>
    );
  }
}

Booking.propTypes = {
  serviceId: string.isRequired,
  getServiceByIdAction: func.isRequired,
  setServiceProvidersAction: func.isRequired,
  setProvidersByServiceIdAction: func.isRequired,
  setAvailabilitiesBySpecialEventBulkAction: func.isRequired,

  setProvidersAction: func.isRequired,
  userDetail: userDetailType.isRequired,
  bookEventAction: func.isRequired,
  bookingStatus: shape({ type: string, message: string }).isRequired,
  resetStatusAction: func.isRequired,
  toggleAppointmentAction: func.isRequired,
  handleOpenProfile: func.isRequired,
  findEventByCustomerIdAction: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.home,
  ...state.booking,
  userDetail: state.auth.userDetail,
  isAuthenticated: state.auth.loginSession.isAuthenticated,
  bookingStatus: state.homeModules.bookingDialog.status,
  bookingEvent: state.appointments.appointments.slice(-1)[0],
});

export default compose(
  connect(
    mapStateToProps,
    {
      getServiceByIdAction,
      setServiceProvidersAction,
      setProvidersByServiceIdAction,
      setAvailabilitiesBySpecialEventBulkAction,

      setProvidersAction: setProviders,
      bookEventAction: bookEvent,
      resetStatusAction: resetStatus,
      toggleAppointmentAction: toggleAppointment,
      findEventByCustomerIdAction,
    },
  ),
)(Booking);
