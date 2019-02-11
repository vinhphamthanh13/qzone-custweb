import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Slide, Dialog, AppBar, Toolbar, IconButton,
  Tabs, Tab, Paper, Avatar, Typography,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';
import mtz from 'moment-timezone';
import logo from 'images/logo.png';
import { serviceType } from 'types/global';
import { setProviders } from 'modules/home/bookingDialog/selectProvider.actions';
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
    this.bookingStepsComponents = {
      provider: SelectProvider,
      time: SelectTime,
      'booking detail': BookingDetail,
    };
    this.defaultState = {
      step: 'provider',
      bookingDetail: {
        provider: undefined,
        time: undefined,
        hourToLocalOffset: 0,
      },
      bookingSteps: [
        { value: 'provider', disabled: false },
        { value: 'time', disabled: true },
        { value: 'booking detail', disabled: true },
      ],
    };
    this.state = { ...this.defaultState };
  }

  onStepChange = (event, step) => {
    this.setState({ step });
  };

  onChangeBookingDetail = (value, key) => {
    let hourToLocalOffset;
    if (key === 'provider') {
      const today = mtz();
      const localOffset = today.clone().utcOffset();
      const providerOffset = today.clone().tz(value.timeZoneId).utcOffset();
      hourToLocalOffset = (localOffset - providerOffset) / 60;
    }
    console.log(hourToLocalOffset);
    this.setState(oldState => ({
      bookingDetail: {
        ...oldState.bookingDetail,
        [key]: value,
        hourToLocalOffset: hourToLocalOffset || oldState.bookingDetail.hourToLocalOffset,
      },
      bookingSteps: [
        { value: 'provider', disabled: false },
        { value: 'time', disabled: false },
        { value: 'booking detail', disabled: key === 'provider' },
      ],
    }));
  };

  handleClose = () => {
    this.props.setProvidersAction([]);
    this.setState(this.defaultState);
    this.props.handleClose();
  }

  render() {
    const { initService, classes } = this.props;
    const { step, bookingDetail, bookingSteps } = this.state;
    const StepComponent = this.bookingStepsComponents[step];

    return (
      <Dialog
        fullScreen
        open={initService !== undefined}
        onClose={this.handleClose}
        TransitionComponent={Transition}
        className={classes.diagRoot}
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
