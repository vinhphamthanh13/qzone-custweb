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
import { serviceType } from 'types/global';
import { setProviders } from 'modules/home/bookingDialog/selectProvider.actions';
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
  }

  handleBack = () => {
    this.setState(oldState => ({ step: oldState.step - 1 }));
  }

  handleNext = () => {
    this.setState(oldState => ({ step: oldState.step + 1 }));
  }

  isStepCompleted = () => {
    const { step, bookingDetail } = this.state;
    switch (step) {
      case 0:
        return !!bookingDetail.provider && !!bookingDetail.time;
      default:
        return false;
    }
  }

  onChangeBookingDetail = (value, key) => {
    this.setState(oldState => ({
      bookingDetail: {
        ...oldState.bookingDetail,
        [key]: value,
      },
    }));
  }

  handleClose = () => {
    this.props.setProvidersAction([]);
    this.setState(this.defaultState);
    this.props.handleClose();
  }

  render() {
    const { initService, classes } = this.props;
    const { step, bookingDetail } = this.state;
    const StepComponent = this.bookingStepsComponents[step];

    return (
      <Dialog
        fullScreen
        open={initService !== undefined}
        onClose={this.handleClose}
        TransitionComponent={Transition}
        classes={{ root: classes.diagRoot }}
      >
        <AppBar position="relative">
          <Toolbar>
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
            bookingDetail={bookingDetail}
          />
        )}
      </Dialog>
    );
  }
}

BookingDialog.propTypes = {
  initService: serviceType,
  handleClose: PropTypes.func.isRequired,
  setProvidersAction: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

BookingDialog.defaultProps = {
  initService: undefined,
};

export default compose(
  withStyles(BookingStyle),
  connect(null, { setProvidersAction: setProviders }),
)(BookingDialog);
