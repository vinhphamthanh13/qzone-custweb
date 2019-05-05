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
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
} from '@material-ui/core';
import {
  ChevronRight,
  LocationOn,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFormik } from 'formik';
import moment from 'moment';
import { get } from 'lodash';
import DatePicker from 'components/Calendar/DatePicker';
import {
  registerWaitListAction,
} from 'actionsReducers/waitlist.actions';
import defaultImage from 'images/default-service-card.png';
import { defaultDateFormat } from 'utils/constants';
import s from './WaitListRegistration.module.scss';

class WaitListRegistration extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      service,
      serviceProviders,
      loginSession,
      userDetail,
    } = props;
    const {
      service: cachedService,
      serviceProviders: cachedServiceProviders,
      loginSession: cachedLoginSession,
      userDetail: cachedUserDetail,
    } = state;
    if (
      service !== cachedService
      || serviceProviders !== cachedServiceProviders
      || loginSession !== cachedLoginSession
      || userDetail !== cachedUserDetail
    ) {
      console.log('state is derived from props', state);
      const providerName = get(serviceProviders, '0.providerName');
      const geoLocation = get(serviceProviders, '0.geoLocation');
      const timezoneId = get(serviceProviders, '0.timezoneId');
      const isAuthenticated = get(loginSession, 'isAuthenticated');
      const customerId = get(userDetail, 'userSub');
      const serviceId = get(serviceProviders, '0.serviceId');
      const providerId = get(serviceProviders, '0.providerId');
      return {
        service,
        serviceProviders,
        providerName,
        geoLocation,
        timezoneId,
        providerId,
        isAuthenticated,
        customerId,
        serviceId,
        loginSession,
        userDetail,
      };
    }
    return null;
  }

  state = {
    dateFrom: moment().unix(),
    dateTo: moment().unix(),
    service: null,
    serviceProviders: null,
    isRegisterWaitLists: false,
    providerName: null,
    geoLocation: null,
    isOpenProviderList: false,
    timezoneId: null,
    providerId: null,
    serviceId: null,
    isAuthenticated: null,
    customerId: null,
    loginSession: null,
    userDetail: null,
  };

  handleToggleRegister = () => {
    this.setState(oldState => ({
      isRegisterWaitLists: !oldState.isRegisterWaitLists,
      isOpenProviderList: false,
    }));
  };

  handleRegisterWaitList = () => {
    const { registerWaitListAction: registerWaitList } = this.props;
    const {
      providerId,
      customerId,
      timezoneId,
      serviceId,
      dateFrom,
      dateTo,
    } = this.state;
    registerWaitList({
      customerId,
      isMakeAppointment: true,
      isNotify: true,
      slot: {
        customerTimezone: timezoneId,
        providerId,
        serviceId,
        sstartSec: '',
        startSec: dateFrom,
        toSec: dateTo,
      },
    });
    this.handleToggleRegister();
  };

  handleChangeOption = (event) => {
    event.preventDefault();
    const { setFieldValue } = this.props;
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  handleChangeDate = key => (date) => {
    this.setState({ [key]: date.unix() });
  };

  handleSelectDate = key => (date) => {
    this.setState({ [key]: date.unix() });
  };

  handleToggleDropdownProviders = () => {
    this.setState(oldState => ({
      isOpenProviderList: !oldState.isOpenProviderList,
    }));
  };

  handleCloseDropdownProviders = () => {
    this.setState({ isOpenProviderList: false });
  };

  handleSelectProvider = provider => () => {
    console.log('provider in selected', provider);
    const providerName = get(provider, 'providerName');
    const geoLocation = get(provider, 'geoLocation');
    const timezoneId = get(provider, 'timezoneId');
    const providerId = get(provider, 'providerId');
    this.setState({
      providerName,
      geoLocation,
      timezoneId,
      providerId,
    });
  };

  renderProviderList = (list) => {
    console.log('in the render serivce providers list', list);
    return (
      <ul className={s.dropdownProviders}>
        {list && list.map(provider => (
          <>
            {/* eslint-disable-next-line */}
            <li className={s.providerItem} onClick={this.handleSelectProvider(provider)}>
              <Typography variant="body1" color="inherit" className="text-bold">
                {provider.providerName}
              </Typography>
            </li>
          </>
        ))}
      </ul>
    );
  };

  render() {
    const {
      service,
      serviceProviders,
      isRegisterWaitLists,
      isOpenProviderList,
      providerName,
      geoLocation,
      timezoneId,
      isAuthenticated,
    } = this.state;
    const {
      values,
      isValid,
    } = this.props;
    const serviceName = get(service, 'name');
    const serviceImg = get(service, 'image.fileUrl') || defaultImage;
    const fullAddress = get(geoLocation, 'fullAddress');
    const joinListLabel = isAuthenticated ? 'Join List' : 'Sign In';
    console.log('state', this.state);
    console.log('waitList component props: ', this.props);

    return (
      <>
        {isRegisterWaitLists && (
          <div className="cover-bg-black ">
            <div className={s.waitListForm}>
              <div className={s.title}>
                <Typography variant="headline" color="inherit" className="text-bold">
                  Enroll to Waitlist
                </Typography>
              </div>
              <div className={s.serviceInfo}>
                <div className={s.serviceImage}>
                  <img src={serviceImg} alt="Service" className={s.serviceImage} />
                </div>
                <div className={s.serviceDescription}>
                  <Typography variant="title" className="main-color-04 text-bold">
                    {serviceName}
                  </Typography>
                  <div className={s.selectProvider}>
                    {serviceProviders && (
                      <>
                        <Typography variant="body1" className="main-color">
                          Appointment with:
                        </Typography>
                        {/* eslint-disable-next-line */}
                        {isOpenProviderList && <div className={s.dropdownBackdrop} onClick={this.handleCloseDropdownProviders} />}
                        {/* eslint-disable-next-line */}
                        <div className={s.selectProviderDropdown} onClick={this.handleToggleDropdownProviders}>
                          <Typography
                            variant="subheading"
                            color="inherit"
                            className={`${s.limitWidth} text-bold`}
                            noWrap
                          >
                            {providerName}
                          </Typography>
                          <ChevronRight className="icon-normal" />
                          {isOpenProviderList && this.renderProviderList(serviceProviders)}
                        </div>
                        <div className="icon-text">
                          <LocationOn className="icon-normal" />
                          <Typography variant="body1" color="inherit">
                            {fullAddress}
                          </Typography>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={s.bookWaitList}>
                  <div className={s.availabilityDate}>
                    <div className={s.availabilityLabel}>
                      <Typography variant="body1" color="inherit" className="text-bold">
                        Date:
                      </Typography>
                      <Typography variant="body1" className="danger-color">
                        ({timezoneId})
                      </Typography>
                    </div>
                    <div className={s.dateRange}>
                      <div className={s.datePicker}>
                        <div className={s.pickerLabel}>
                          <Typography variant="caption" color="inherit" className="text-bold">
                            From:
                          </Typography>
                        </div>
                        <DatePicker
                          onChange={this.handleChangeDate('dateFrom')}
                          selectDate={this.handleSelectDate}
                          enableCalendar
                          type="date"
                          isIcon
                          iconClassName={s.dateSelection}
                          dateFormat={defaultDateFormat}
                        />
                      </div>
                      <div className={s.datePicker}>
                        <div className={s.pickerLabel}>
                          <Typography variant="caption" color="inherit" className="text-bold">
                            To:
                          </Typography>
                        </div>
                        <DatePicker
                          onChange={this.handleChangeDate('dateTo')}
                          selectDate={this.handleSelectDate}
                          enableCalendar
                          type="date"
                          isIcon
                          iconClassName={s.dateSelection}
                          dateFormat={defaultDateFormat}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={s.selectOption}>
                    <div className={s.bookingOption}>
                      <RadioGroup
                        name="enrollOption"
                        value={values.enrollOption}
                        onChange={this.handleChangeOption}
                      >
                        <FormControlLabel
                          value="automatically"
                          control={(
                            <Radio classes={
                              {
                                root: s.bookingOption,
                                checked: s.bookingOptionChecked,
                              }
                            }
                            />)}
                          label="Make your appointment automatically."
                        />
                        <FormControlLabel
                          value="manually"
                          control={(
                            <Radio classes={
                              {
                                root: s.bookingOption,
                                checked: s.bookingOptionChecked,
                              }
                            }
                            />)}
                          label="Notify me on slot availability."
                        />
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.footerCta}>
                <Button variant="outlined" onClick={this.handleToggleRegister}>
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleRegisterWaitList}
                  disabled={!isValid}
                  className="main-button"
                >
                  {joinListLabel}
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* eslint-disable-next-line */}
        <div
          className={s.joinWaitLists}
          onClick={this.handleToggleRegister}
        >
          <Typography
            variant="subheading"
            className="white-color text-bold"
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
    isInitialValid: true,
    mapPropsToValues: () => ({
      enrollOption: 'automatically',
    }),
  }),
  connect(mapStateToProps, {
    registerWaitListAction,
  }),
)(WaitListRegistration);
