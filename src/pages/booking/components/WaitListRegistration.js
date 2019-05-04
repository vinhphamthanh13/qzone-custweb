import React, { Component } from 'react';
import {
  func,
  // bool,
  // objectOf,
  // object,
  // any,
} from 'prop-types';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFormik } from 'formik';
import {
  registerWaitListAction,
} from 'actionsReducers/waitlist.actions';
import s from 'pages/booking/components/SelectProvider.module.scss';

class WaitListRegistration extends Component {
  state = {
    isRegisterWaitLists: false,
  };

  handleToggleRegister = () => {
    this.setState(oldState => ({
      isRegisterWaitLists: !oldState.isRegisterWaitLists,
    }));
  };

  handleRegisterWaitList = () => {
    const { registerWaitListAction: registerWaitList } = this.props;
    registerWaitList();
  };

  render() {
    const { isRegisterWaitLists } = this.state;
    console.log('waitlist component props: ', this.props);
    return (
      <>
        {isRegisterWaitLists && (
          <div className="cover-bg-black ">
            <Typography
              variant="title"
              color="inherit"
              onClick={this.handleToggleRegister}
            >Join waitList
            </Typography>
          </div>
        )}
        <div className={s.joinWaitLists}>
          <Typography
            variant="subheading"
            className="white-color text-bold"
            onClick={this.handleToggleRegister}
          >
            Join Queue
          </Typography>
        </div>
      </>
    );
  }
}

WaitListRegistration.propTypes = {
  registerWaitListAction: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.booking,
});

export default compose(
  withFormik({
    enableReinitialize: true,
  }),
  connect(mapStateToProps, {
    registerWaitListAction,
  }),
)(WaitListRegistration);
