import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
import { serviceType, userDetailType } from 'types/global';
import { setProviders } from 'reduxModules/home/bookingDialog/selectProvider.actions';
import { bookEvent, resetStatus } from 'reduxModules/home/bookingDialog.actions';
import CustomModal from 'components/Modal/CustomModal';
import SelectProvider from './bookingDialog/SelectProvider';
import BookingDetail from './bookingDialog/BookingDetail';
import BookingStyle from './BookingDialogStyle';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

/* eslint-disable react/no-unused-state */
class BookingDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.bookingStepsComponents = [SelectProvider, BookingDetail];
    this.bookingSteps = ['Select provider', 'Booking detail'];
    this.defaultState = {
      step: 0,
      bookingDetail: {
        provider: undefined,
        time: undefined,
        day: undefined,
      },
    };
    this.state = { ...this.defaultState };
  }

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
  }

  closeInfoModal = () => {
    this.handleBack();
    this.props.resetStatusAction();
  }

  render() {
    const {
      initService, classes, userDetail,
      isLoading, bookingStatus,
    } = this.props;
    const { step, bookingDetail } = this.state;
    const StepComponent = this.bookingStepsComponents[step];

    return (
      <>
        <CustomModal
          type={bookingStatus.type}
          title={bookingStatus.type === 'error' ? 'Booking failed' : 'Booking succeeded'}
          message={bookingStatus.message}
          isOpen={!!bookingStatus.type}
          onClose={this.closeInfoModal}
        />
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
              disabled={step === 0}
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
              onSaveBooking={this.onSaveBooking}
              isLoading={isLoading}
            />
          )}
        </Dialog>
      </>
    );
  }
}

BookingDialog.propTypes = {
  initService: serviceType,
  handleClose: PropTypes.func.isRequired,
  setProvidersAction: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  userDetail: userDetailType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  openDialog: PropTypes.func.isRequired,
  bookEventAction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  bookingStatus: PropTypes.shape({ type: PropTypes.string, message: PropTypes.string }).isRequired,
  resetStatusAction: PropTypes.func.isRequired,
};

BookingDialog.defaultProps = {
  initService: undefined,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetails,
  isAuthenticated: state.auth.loginSession.isAuthenticated,
  isLoading: state.homeModules.bookingDialog.isLoading,
  bookingStatus: state.homeModules.bookingDialog.status,
});

export default compose(
  withStyles(BookingStyle),
  connect(
    mapStateToProps,
    {
      setProvidersAction: setProviders,
      bookEventAction: bookEvent,
      resetStatusAction: resetStatus,
    },
  ),
)(BookingDialog);
