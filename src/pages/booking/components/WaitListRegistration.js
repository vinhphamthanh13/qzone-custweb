import React, { Component } from 'react';
import {
  func,
  bool,
  objectOf,
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
  Queue,
  Cancel,
  Fingerprint,
} from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFormik } from 'formik';
import moment from 'moment';
import {
  get,
} from 'lodash';
import DatePicker from 'components/Calendar/DatePicker';
import {
  // setWaitListsValidationAction,
  registerWaitListsAction,
} from 'actionsReducers/waitlist.actions';
import defaultImage from 'images/default-service-card.png';
import {
  defaultDateFormat,
  AUTHENTICATED_KEY,
} from 'utils/constants';
import s from './WaitListRegistration.module.scss';

const DATE_RANGE_INVERT = {
  dateFrom: 'dateTo',
  dateTo: 'dateFrom',
};

class WaitListRegistration extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      providers,
      service,
      loginSession,
      userDetail,
      waitListsValidation,
    } = props;
    const {
      providers: cachedProviders,
      service: cachedService,
      loginSession: cachedLoginSession,
      userDetail: cachedUserDetail,
      waitListsValidation: cachedWaitListsValidation,
    } = state;
    if (
      service !== cachedService
      || providers !== cachedProviders
      || loginSession !== cachedLoginSession
      || userDetail !== cachedUserDetail
      || waitListsValidation !== cachedWaitListsValidation
    ) {
      const serviceId = get(service, 'id');
      const queuedProviders = providers && providers.filter(provider => provider.mode === 'QUEUE');
      const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
      const customerId = get(userDetail, 'userSub');
      const isQueuing = queuedProviders && !!queuedProviders.length;

      return {
        service,
        queuedProviders,
        isAuthenticated,
        customerId,
        serviceId,
        loginSession,
        userDetail,
        isQueuing,
        waitListsValidation,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const initProvider = get(props, 'initProvider');
    const temporaryServiceIds = get(initProvider, 'temporaryServiceIds');
    const providerName = get(initProvider, 'providerName');
    const geoLocation = get(initProvider, 'geoLocation');
    const timezoneId = get(initProvider, 'timezoneId');

    this.state = {
      dateFrom: moment().unix(),
      dateTo: moment().unix(),
      service: null,
      isRegisterWaitLists: false,
      temporaryServiceIds,
      providerName,
      geoLocation,
      timezoneId,
      isOpenProviderList: false,
      isAuthenticated: null,
      customerId: null,
      queuedProviders: null,
      isQueuing: null,
    };
  }

  handleToggleRegister = () => {
    const { handleAuth } = this.props;
    const { isAuthenticated } = this.state;
    if (isAuthenticated) {
      this.setState(oldState => ({
        isRegisterWaitLists: !oldState.isRegisterWaitLists,
        isOpenProviderList: false,
      }));
    } else {
      handleAuth('isLoginOpen');
    }
  };

  handleRegisterWaitList = () => {
    const {
      // setWaitListsValidationAction: setWaitListsValidation,
      registerWaitListsAction: registerWaitLists,
    } = this.props;
    const {
      customerId,
      dateFrom,
      dateTo,
      temporaryServiceIds,
    } = this.state;

    const startSec = dateFrom + 1; // Plus one second for startSec
    const toSec = dateTo + 3600 * 24; // Plus one day
    const waitListData = temporaryServiceIds.map(id => ({
      customerId,
      startSec,
      tempServiceId: id,
      toSec,
    }));
    // setWaitListsValidation(validateData);
    registerWaitLists(waitListData);
    this.handleToggleRegister();
  };

  handleChangeOption = (event) => {
    event.preventDefault();
    const { setFieldValue } = this.props;
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  handleChangeDate = key => (date) => {
    const { dateFrom, dateTo } = this.state;
    let newDate = null;
    if (key === 'dateFrom' && moment(date) > moment(dateTo * 1000)) {
      newDate = date;
    } else if (key === 'dateTo' && moment(date) < moment(dateFrom * 1000)) {
      newDate = date;
    }
    this.setState(oldState => ({
      [key]: date.unix(),
      [DATE_RANGE_INVERT[key]]: newDate ? newDate.unix() : oldState[DATE_RANGE_INVERT[key]],
    }));
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
    const providerName = get(provider, 'providerName');
    const geoLocation = get(provider, 'geoLocation');
    const timezoneId = get(provider, 'timezoneId');
    const temporaryServiceIds = get(provider, 'temporaryServiceIds');
    console.log('provider', provider);
    this.setState({
      providerName,
      geoLocation,
      timezoneId,
      temporaryServiceIds,
    });
  };

  renderProviderList = list => (
    <div className={s.dropdownProviders}>
      {list && list.map(provider => (
        /* eslint-disable-next-line */
        <div key={uuidv1()} className={s.providerItem} onClick={this.handleSelectProvider(provider)}>
          <Typography variant="body1" color="inherit" className="text-bold">
            {provider.providerName}
          </Typography>
          <Typography variant="body2" color="inherit">
            {provider.geoLocation.fullAddress}
          </Typography>
        </div>
      ))}
    </div>
  );

  renderEnrollButton = isAuthenticated => (isAuthenticated ? (
    <>
      <Queue color="inherit" className="icon-small" />
      <Typography variant="body1" color="inherit">
        Join Queue
      </Typography>
    </>
  ) : (
    <>
      <Fingerprint color="inherit" className="icon-small" />
      <Typography variant="body1" color="inherit">
        Sign in
      </Typography>
    </>
  ));

  render() {
    const {
      service,
      isRegisterWaitLists,
      isOpenProviderList,
      providerName,
      geoLocation,
      timezoneId,
      isAuthenticated,
      dateFrom,
      dateTo,
      queuedProviders,
      isQueuing,
    } = this.state;
    const {
      values,
      isValid,
    } = this.props;
    const serviceName = get(service, 'name');
    const serviceImg = get(service, 'image.fileUrl') || defaultImage;
    const fullAddress = get(geoLocation, 'fullAddress');
    return (
      <>
        {isRegisterWaitLists && (
          <div className="cover-bg-black z-index-high">
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
                  <div className={s.enrollServiceName}>
                    <Typography variant="title" className="main-color-04 text-bold" noWrap>
                      {serviceName}
                    </Typography>
                  </div>
                  <div className={s.selectProvider}>
                    {isQueuing && (
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
                          {isOpenProviderList && this.renderProviderList(queuedProviders)}
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
                          date={moment(dateFrom * 1000)}
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
                          date={moment(dateTo * 1000)}
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
                <Button
                  variant="outlined"
                  onClick={this.handleToggleRegister}
                  className="secondary-button"
                >
                  <Cancel color="inherit" className="icon-small" />
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleRegisterWaitList}
                  disabled={!isValid}
                  className="main-button"
                >
                  <Queue color="inherit" className="icon-small" />
                  Enroll
                </Button>
              </div>
            </div>
          </div>
        )}
        <Button
          className={`${s.joinWaitLists} simple-button main-button`}
          onClick={this.handleToggleRegister}
          disabled={!isQueuing}
          variant="outlined"
        >
          {this.renderEnrollButton(isAuthenticated)}
        </Button>
      </>
    );
  }
}

WaitListRegistration.propTypes = {
  values: objectOf(any).isRequired,
  setFieldValue: func.isRequired,
  isValid: bool.isRequired,
  handleAuth: func.isRequired,
  // setWaitListsValidationAction: func.isRequired,
  registerWaitListsAction: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.booking,
  ...state.auth,
  ...state.waitLists,
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
    // setWaitListsValidationAction,
    registerWaitListsAction,
  }),
)(WaitListRegistration);
