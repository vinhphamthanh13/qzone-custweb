import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Dialog, Slide, AppBar, Toolbar,
  IconButton, Avatar, Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import { toggleAppointment } from 'reduxModules/appointments.actions';
import logo from 'images/logo.png';
import AppointmentContainer from './appointmentDialog/Appointment';
import BookingStyle from './BookingDialogStyle';

class AppointmentDialog extends React.PureComponent {
  state = {};

  static getDerivedStateFromProps(props) {
    if (props.match.path === '/appointments' && !props.isOpen) {
      if (!props.userId) {
        props.history.replace('/');
      } else {
        props.toggleAppointmentAction(true);
      }
    } else if (props.match.path !== '/appointments' && props.isOpen) {
      props.history.replace('/appointments');
    }

    return {};
  }

  toggleDialog = () => {
    const { isOpen, toggleAppointmentAction, history: { replace } } = this.props;
    toggleAppointmentAction(!isOpen);
    replace(isOpen ? '/' : '/appointments');
  };

  render() {
    const { classes, isOpen } = this.props;

    return (
      <Dialog
        fullScreen
        open={isOpen}
        onClose={this.handleClose}
        TransitionComponent={Slide}
      >
        <AppBar position="relative">
          <Toolbar className={classes.mainLinear}>
            <Avatar src={logo} alt="Quezone Logo" className={classes.avatar} />
            <Typography variant="subtitle1" color="inherit">Your Appointments</Typography>
            <div className="grow" />
            <IconButton color="inherit" onClick={this.toggleDialog} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AppointmentContainer />
      </Dialog>
    );
  }
}

AppointmentDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleAppointmentAction: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  isOpen: state.appointments.isOpen,
  userId: state.auth.loginSession.id,
});

const mapDispatchToProps = dispatch => ({
  toggleAppointmentAction: isOpen => dispatch(toggleAppointment(isOpen)),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(BookingStyle),
)(AppointmentDialog);
