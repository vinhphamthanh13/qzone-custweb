import React, { PureComponent } from 'react';
import {
  string, func, shape,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  IconButton,
  Avatar,
  Button, Typography,
} from '@material-ui/core';
import moment from 'moment';
import {
  Close,
  ChevronLeft,
  ChevronRight,
} from '@material-ui/icons';
import { get } from 'lodash';
import logo from 'images/quezone-logo.png';
import {
  userDetailType,
} from 'types/global';
import CustomModal from 'components/Modal/CustomModal';
import { history } from 'containers/App';
import { findEventByCustomerIdAction } from 'actionsReducers/common.actions';

import { setProviders } from 'reduxModules/home/bookingDialog/selectProvider.actions';
import { bookEvent, resetStatus } from 'reduxModules/home/bookingDialog.actions';
import { toggleAppointment } from 'reduxModules/appointments.actions';
import SelectProvider from './components/SelectProvider';
import BookingDetail from './components/BookingDetail';
import ViewAppointment from './components/ViewAppointment';
import s from './Booking.module.scss';

const STEP_LABELS = ['Select provider', 'Book appointment', 'Complete booking'];

class Booking extends PureComponent {
  constructor(props) {
    super(props);
    this.stepComponents = [SelectProvider, BookingDetail, ViewAppointment];
    this.defaultState = {
      step: 0,
      bookingDetail: {
        provider: undefined,
        time: undefined,
      },
      isConfirmDialogOpen: false,
    };
    this.state = { ...this.defaultState };
  }

  componentDidUpdate = (prevProps) => {
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
    console.log('bookingDetail', bookingDetail);
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

  render() {
    const {
      bookingStatus,
      // initService,
      // userDetail,
      // isLoading,
      // bookingEvent,
      // openDialog,
    } = this.props;
    const { step, bookingDetail, isConfirmDialogOpen } = this.state;
    const Step = this.stepComponents[step];
    const isBackValid = !(step === 0 || step === STEP_LABELS.length - 1);
    const isNextValid = !(step === STEP_LABELS.length - 1 || !this.isStepCompleted());
    console.log('select provider', this.props);

    return (
      <>
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
            <div className="closeBook">
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <Close />
              </IconButton>
            </div>
          </div>
          <Step />
        </div>
      </>
    );
  }
}

Booking.propTypes = {
  serviceId: string.isRequired,
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
  userDetail: state.auth.userDetail,
  isAuthenticated: state.auth.loginSession.isAuthenticated,
  isLoading: state.homeModules.bookingDialog.isLoading,
  bookingStatus: state.homeModules.bookingDialog.status,
  bookingEvent: state.appointments.appointments.slice(-1)[0],
});

export default compose(
  connect(
    mapStateToProps,
    {
      setProvidersAction: setProviders,
      bookEventAction: bookEvent,
      resetStatusAction: resetStatus,
      toggleAppointmentAction: toggleAppointment,
      findEventByCustomerIdAction,
    },
  ),
)(Booking);
