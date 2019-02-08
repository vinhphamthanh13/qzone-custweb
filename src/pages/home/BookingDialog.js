import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Slide, Dialog, AppBar, Toolbar, IconButton,
  Tabs, Tab, Paper, Avatar, Typography,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';
import logo from 'images/logo.png';
import { serviceType } from 'types/global';
import SelectProvider from './bookingDialog/SelectProvider';
import SelectTime from './bookingDialog/SelectTime';
import BookingDetail from './bookingDialog/BookingDetail';
import BookingStyle from './BookingDialogStyle';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

/* eslint-disable react/no-unused-state */
class BookingDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 'provider',
      bookingDetail: {
        provider: undefined,
        time: undefined,
      },
      bookingSteps: [
        { value: 'provider', disabled: false },
        { value: 'time', disabled: true },
        { value: 'booking detail', disabled: true },
      ],
    };
    this.bookingStepsComponents = {
      provider: SelectProvider,
      time: SelectTime,
      'booking detail': BookingDetail,
    };
  }

  onStepChange = (event, step) => {
    this.setState({ step });
  };

  onChangeBookingDetail = (value, key) => {
    const { bookingDetail } = this.state;

    if (key === 'provider') {
      if (bookingDetail.time) {
        this.setState(oldState => ({
          bookingDetail: { ...oldState.bookingDetail, [key]: value },
          bookingSteps: [
            { value: 'provider', disabled: false },
            { value: 'time', disabled: false },
            { value: 'booking detail', disabled: false },
          ],
        }));
      } else {
        this.setState(oldState => ({
          bookingDetail: { ...oldState.bookingDetail, [key]: value },
          bookingSteps: [
            { value: 'provider', disabled: false },
            { value: 'time', disabled: false },
            { value: 'booking detail', disabled: true },
          ],
        }));
      }
    } else {
      this.setState(oldState => ({
        bookingDetail: { ...oldState.bookingDetail, [key]: value },
        bookingSteps: [
          { value: 'provider', disabled: false },
          { value: 'time', disabled: false },
          { value: 'booking detail', disabled: false },
        ],
      }));
    }
  };

  render() {
    const { initService, handleClose, classes } = this.props;
    console.log('initService', initService);
    const { step, bookingDetail, bookingSteps } = this.state;
    const StepComponent = this.bookingStepsComponents[step];
    const stepCompProps = step === 'time'
      ? { initService, onChange: this.onChangeBookingDetail }
      : { initService, onChange: this.onChangeBookingDetail, bookingDetail };

    return (
      <Dialog
        fullScreen
        open={initService !== undefined}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar position="relative">
          <Toolbar>
            <Avatar src={logo} alt="Quezone Logo" className={classes.avatar} />
            {initService && <Typography variant="subtitle1" color="inherit">{initService.name}</Typography>}
            <div className="grow" />
            <IconButton color="inherit" onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Paper square>
          <Tabs
            centered
            indicatorColor="primary"
            textColor="primary"
            value={step}
            onChange={this.onStepChange}
          >
            {bookingSteps.map(
              bookingStep => (
                <Tab
                  {...bookingStep}
                  key={bookingStep.value}
                  label={bookingStep.value}
                />
              ),
            )}
          </Tabs>
        </Paper>
        {<StepComponent
          {...stepCompProps}
        />}
      </Dialog>
    );
  }
}

BookingDialog.propTypes = {
  initService: serviceType,
  handleClose: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

BookingDialog.defaultProps = {
  initService: undefined,
};

export default withStyles(BookingStyle)(BookingDialog);
