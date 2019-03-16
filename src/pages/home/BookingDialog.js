import React, { PureComponent } from 'react';
import {
  string, bool, func, shape, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Slide, Dialog, AppBar, Toolbar, IconButton,
  Avatar, Typography, Button,
  Stepper, Step, StepLabel,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';
import logo from 'images/logo.png';
import { serviceType, userDetailType, eventType } from 'types/global';
import { setProviders } from 'reduxModules/home/bookingDialog/selectProvider.actions';
import { bookEvent, resetStatus } from 'reduxModules/home/bookingDialog.actions';
import CustomModal from 'components/Modal/CustomModal';
import { toggleAppointment } from 'reduxModules/appointments.actions';
import SelectProvider from './bookingDialog/SelectProvider';
import BookingDetail from './bookingDialog/BookingDetail';
import BookingStyle from './BookingDialogStyle';
import ViewAppointment from './bookingDialog/ViewAppointment';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class BookingDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.bookingStepsComponents = [SelectProvider, BookingDetail, ViewAppointment];
    this.bookingSteps = ['Select provider', 'Book appointment', 'Complete booking'];
    this.defaultState = {
      step: 0,
      bookingDetail: {
        provider: undefined,
        time: undefined,
        day: undefined,
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
    this.props.setProvidersAction([]);
    this.setState(this.defaultState);
    this.props.handleClose();
  };

  onSaveBooking = () => {
    this.toggleConfirmDialog(false)();

    if (this.props.isAuthenticated) {
      const { userDetail, bookEventAction, initService } = this.props;
      const { bookingDetail } = this.state;

      bookEventAction({
        customerId: userDetail.id,
        duration: bookingDetail.time.duration,
        slot: {
          providerId: bookingDetail.provider.id,
          serviceId: initService.id,
          startSec: bookingDetail.time.start / 1000,
        },
        status: 'BOOKING_STATUS_UNSPECIFIED',
        type: 'APPOINTMENT',
      });
    } else {
      this.props.openDialog('isLoginOpen');
    }
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

  render() {
    const {
      initService, classes, userDetail,
      isLoading, bookingStatus, bookingEvent,
      handleOpenProfile,
    } = this.props;
    const { step, bookingDetail, isConfirmDialogOpen } = this.state;
    const StepComponent = this.bookingStepsComponents[step];

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
        <Dialog
          fullScreen
          open={initService !== undefined}
          onClose={this.handleClose}
          TransitionComponent={Transition}
          classes={{ root: classes.diagRoot }}
        >
          <AppBar position="relative">
            <Toolbar className={classes.mainLinear}>
              <Avatar src={logo} alt="Quezone Logo" className={classes.avatar} />
              {initService && <Typography variant="subtitle1" color="inherit">{initService.name}</Typography>}
              <div className="grow" />
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div className={classes.bookingStepsWrapper}>
            <Button
              disabled={step === 0 || step === this.bookingSteps.length - 1}
              onClick={this.handleBack}
            >
              Back
            </Button>
            <Stepper classes={{ root: classes.bookingStepper }} elevation={1} activeStep={step}>
              {this.bookingSteps.map(bookingStep => (
                <Step key={bookingStep}>
                  <StepLabel>
                    {bookingStep}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Button
              color="primary"
              disabled={step === this.bookingSteps.length - 1 || !this.isStepCompleted()}
              onClick={this.handleNext}
            >
              Next
            </Button>
          </div>
          {initService && (
            <StepComponent
              initService={initService}
              onChange={this.onChangeBookingDetail}
              handleNext={this.handleNext}
              bookingDetail={bookingDetail}
              userDetail={userDetail}
              onSaveBooking={this.toggleConfirmDialog(true)}
              isLoading={isLoading}
              bookingEvent={bookingEvent}
              openAppointmentDialog={this.openAppointmentDialog}
              handleOpenProfile={handleOpenProfile}
            />
          )}
        </Dialog>
      </>
    );
  }
}

BookingDialog.propTypes = {
  initService: serviceType,
  handleClose: func.isRequired,
  setProvidersAction: func.isRequired,
  classes: objectOf(any).isRequired,
  userDetail: userDetailType.isRequired,
  isAuthenticated: bool.isRequired,
  openDialog: func.isRequired,
  bookEventAction: func.isRequired,
  isLoading: bool.isRequired,
  bookingStatus: shape({ type: string, message: string }).isRequired,
  resetStatusAction: func.isRequired,
  bookingEvent: eventType,
  toggleAppointmentAction: func.isRequired,
  handleOpenProfile: func.isRequired,
};

BookingDialog.defaultProps = {
  initService: undefined,
  bookingEvent: undefined,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetails,
  isAuthenticated: state.auth.loginSession.isAuthenticated,
  isLoading: state.homeModules.bookingDialog.isLoading,
  bookingStatus: state.homeModules.bookingDialog.status,
  bookingEvent: state.appointments.appointments.slice(-1)[0],
});

export default compose(
  withStyles(BookingStyle),
  connect(
    mapStateToProps,
    {
      setProvidersAction: setProviders,
      bookEventAction: bookEvent,
      resetStatusAction: resetStatus,
      toggleAppointmentAction: toggleAppointment,
    },
  ),
)(BookingDialog);
