import React, { Component } from 'react';
import {
  func,
  bool,
  objectOf,
  // object,
  any,
} from 'prop-types';
import {
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFormik } from 'formik';
import DatePicker from 'components/Calendar/DatePicker';
import {
  registerWaitListAction,
} from 'actionsReducers/waitlist.actions';
import defaultImage from 'images/default-service-card.png';
import s from './WaitListRegistration.module.scss';

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

  handleChange = (event) => {
    event.preventDefault();
    const { setFieldValue } = this.props;
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  handleChangeDate = (date) => {
    console.log('date on Change', date);
  };

  handleSelectDate = (date) => {
    console.log('date selected', date);
  };

  render() {
    const { isRegisterWaitLists } = this.state;
    console.log('waitlist component props: ', this.props);
    const {
      values,
      isValid,
    } = this.props;
    return (
      <>
        {isRegisterWaitLists && (
          <div className="cover-bg-black ">
            <div className={s.waitListForm}>
              <div className={s.title}>
                <Typography variant="headline" className="danger-color">
                  Join Waited Lists
                </Typography>
              </div>
              <div className={s.serviceInfo}>
                <div className={s.serviceImage}>
                  <img src={defaultImage} alt="Service" />
                </div>
                <Typography variant="title" className="main-color-04 text-bold">
                  Vital Veda
                </Typography>
                <Typography variant="body1" className="main-color">
                  185 Old South Head Road Junction New South Wales 2022
                </Typography>
                <div className={s.dateRange}>
                  <div className={s.dateStart}>
                    <DatePicker
                      onChange={this.handleChangeDate}
                      selectDate={this.handleSelectDate}
                      enableCalendar
                      type="date"
                    />
                  </div>
                </div>
                <div className={s.timeRange}>
                  <TextField
                    id="startTime"
                    label="Start"
                    name="startTime"
                    value={0}
                  />
                  <TextField
                    label="Start"
                    name="endTime"
                    value={0}
                  />
                </div>
              </div>
              <RadioGroup
                name="waitlistregistration"
                value={values.waitlistregistration}
                onChange={this.handleChange}
              >
                <FormControlLabel value="provider" control={<Radio />} label="provider" />
                <FormControlLabel value="customer" control={<Radio />} label="customer" />
              </RadioGroup>
              <div className={s.footerCta}>
                <Button variant="outlined" onClick={this.handleToggleRegister}>
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleRegisterWaitList}
                  disabled={!isValid}
                >
                  Join List
                </Button>
              </div>
            </div>
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
  values: objectOf(any).isRequired,
  setFieldValue: func.isRequired,
  isValid: bool.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.booking,
  ...state.auth,
});

export default compose(
  withFormik({
    enableReinitialize: true,
  }),
  connect(mapStateToProps, {
    registerWaitListAction,
  }),
)(WaitListRegistration);
