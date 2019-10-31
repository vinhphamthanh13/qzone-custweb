/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { func } from 'prop-types';
import { Button, InputBase, IconButton } from '@material-ui/core';
import {
  ChevronRight, LocationOn, WrapText, Cancel, Clear, HowToReg, GpsFixed, DateRange,
} from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import get from 'lodash/get';
import noop from 'lodash/noop';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { ADDRESS_LENGTH, FULL_DATE, WAIT_LIST_KEYS } from 'utils/constants';
import defaultImage from 'images/providers.jpg';
import { waitListProps } from 'pages/commonProps';
import { limitString } from 'utils/common';
import ClientForm from '../booking/ClientForm';
import s from './WaitList.module.scss';

class WaitList extends Component {
  static propTypes = {
    handleAuth: func.isRequired,
    onClose: func.isRequired,
    dispatchWaitListTemporaryServicesByServiceId: func.isRequired,
    dispatchRegisterWaitLists: func.isRequired,
  };

  initState = {
    service: {},
    queuedProviders: [],
    userDetail: {},
    [WAIT_LIST_KEYS.SELECTED_PID]: '',
    [WAIT_LIST_KEYS.SELECTED_P_NAME]: '',
    [WAIT_LIST_KEYS.SELECTED_LOC_ID]: '',
    [WAIT_LIST_KEYS.SELECTED_TEMP_SERVICE_ID]: '',
    queuedTemporaryServiceIds: {},
    isProvidersPopup: false,
    isLocationsPopup: false,
    initProvider: {},
  };

  state = { ...this.initState };

  static getDerivedStateFromProps(props, state) {
    const { service, userDetail, waitListTemporaryServicesByServiceId } = props;
    const {
      service: cachedService,
      userDetail: cachedUserDetail,
      waitListTemporaryServicesByServiceId: cachedWaitListTemporaryServicesByServiceId,
    } = state;
    const updatedState = {};
    if (
      service !== null &&
      JSON.stringify(service) !== JSON.stringify(cachedService)
    ) {
      updatedState.serviceId = get(service, 'id');
      updatedState.service = service;
    }
    if (
      userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (
      waitListTemporaryServicesByServiceId !== null &&
      JSON.stringify(waitListTemporaryServicesByServiceId) !==
      JSON.stringify(cachedWaitListTemporaryServicesByServiceId)
    ) {
      updatedState.waitListTemporaryServicesByServiceId = waitListTemporaryServicesByServiceId;
      const queuedProviders = {};
      const queuedTemporaryServiceIds = {};
      waitListTemporaryServicesByServiceId.map(item => {
        const selectedPId = get(item, 'providerId');
        const selectedPName = get(item, 'providerName');
        const selectedLocId = get(item, 'geoLocation.id');
        const fullAddress = get(item, 'geoLocation.fullAddress');
        const startDate = get(item, 'startDate');
        const timezoneId = get(item, 'timezoneId');
        const selectedTemporaryServiceId = get(item, 'id');
        updatedState.selectedPId = selectedPId;
        updatedState.selectedPName = selectedPName;
        updatedState.selectedLocId = selectedLocId;
        updatedState.selectedTemporaryServiceId = selectedTemporaryServiceId;
        queuedProviders[selectedPName] = queuedProviders[selectedPName] ? queuedProviders[selectedPName] : [];
        queuedProviders[selectedPName].push(
          {selectedPName, selectedPId, selectedLocId, selectedTemporaryServiceId, fullAddress, startDate, timezoneId },
        );
        queuedTemporaryServiceIds[`${selectedPId}-${selectedLocId}`] = selectedTemporaryServiceId;
        return null;
      });
      updatedState.queuedProviders = queuedProviders;
      updatedState.queuedTemporaryServiceIds = queuedTemporaryServiceIds;
      updatedState.initProvider = !isEmpty(queuedProviders) && queuedProviders[Object.keys(queuedProviders)[0]][0];
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchWaitListTemporaryServicesByServiceId } = this.props;
    const { service } = this.state;
    dispatchWaitListTemporaryServicesByServiceId(service.id);
  }

  handleCloseWaitList = () => {
    const { onClose } = this.props;
    this.setState({
      ...this.initState,
    }, onClose);
  };

  handleRegisterWaitList = () => {
    const { dispatchRegisterWaitLists } = this.props;
    const { selectedTemporaryServiceId, userDetail } = this.state;
    const customerId = get(userDetail, 'userSub') || get(userDetail, 'id');
    dispatchRegisterWaitLists({
      customerId, tempServiceId: selectedTemporaryServiceId, startSec: 0, toSec: 0,
    });
    this.handleCloseWaitList();
  };

  toggleProvidersList = () => {
    this.setState(oldState => ({
      isProvidersPopup: !oldState.isProvidersPopup,
    }));
  };

  toggleLocationsList = () => {
    this.setState(oldState => ({
      isLocationsPopup: !oldState.isLocationsPopup,
    }))
  };

  handleSelectProvider = (item, setFieldValue) => () => {
    const { queuedTemporaryServiceIds, selectedLocId } = this.state;
    setFieldValue('providerName', item[WAIT_LIST_KEYS.SELECTED_P_NAME]);
    this.setState({
      [WAIT_LIST_KEYS.SELECTED_P_NAME]: item[WAIT_LIST_KEYS.SELECTED_P_NAME],
      [WAIT_LIST_KEYS.SELECTED_PID]: item[WAIT_LIST_KEYS.SELECTED_PID],
      [WAIT_LIST_KEYS.SELECTED_TEMP_SERVICE_ID]: queuedTemporaryServiceIds[
        `${item[WAIT_LIST_KEYS.SELECTED_PID]}-${selectedLocId}`
        ] || '',
    });
    this.toggleProvidersList();
  };

  handleSelectLocation = (item, setFieldValue) => () => {
    setFieldValue('fullAddress', item.fullAddress);
    setFieldValue('startDate', item.startDate);
    setFieldValue('timezoneId', item.timezoneId);
    this.setState({
      [WAIT_LIST_KEYS.SELECTED_LOC_ID]: item[WAIT_LIST_KEYS.SELECTED_LOC_ID],
      selectedTemporaryServiceId: item.selectedTemporaryServiceId || '',
    });
    this.toggleLocationsList();
  };

  renderProviderList = (list, setFieldValue) => (
    <div className={s.itemList}>
      <div className={s.closePopup}>
        <div className={s.popUpTitle}>
          Our providers
        </div>
        <Clear className="hover-pointer" color="secondary" onClick={this.toggleProvidersList} />
      </div>
      {Object.keys(list).map((name) => (
          <div
            key={uuidv1()}
            className={s.item}
            onClick={this.handleSelectProvider({
              selectedPName: name,
              selectedPId: list[name][0].selectedPId,
            }, setFieldValue)}
          >
            {name}
          </div>
        ))}
    </div>
  );

  renderLocationList = setFieldValue => {
    const { queuedProviders, selectedPName } = this.state;
    return (<div className={s.itemList}>
      <div className={s.closePopup}>
        <div className={s.popUpTitle}>
          Available locations
        </div>
        <Clear className="hover-pointer" color="secondary" onClick={this.toggleLocationsList} />
      </div>
      {queuedProviders[selectedPName].map(item => (
        <div
          key={uuidv1()}
          className={s.item}
          onClick={this.handleSelectLocation(item, setFieldValue)}
        >
          {item.fullAddress}
          <div className={s.locFooter}>
            <div className={s.locLabel}>
              Open date:
            </div>
            <div className={s.queuedDate}>
              <DateRange className="icon-small" color="secondary" />
              <span>&nbsp;{moment(item.startDate).format(FULL_DATE)}</span>
            </div>
            <div className={s.locTimezone}>
              <GpsFixed className="icon-small" color="secondary" />
              <span>&nbsp;{item.timezoneId}</span>
            </div>
          </div>
        </div>
      ))

      }
    </div>);
  };

  handleLogin = () => {
    const { handleAuth } = this.props;
    handleAuth('isLoginOpen');
  };

  render() {
    const {
      service, isProvidersPopup, isLocationsPopup, userDetail, queuedProviders, initProvider,
      selectedTemporaryServiceId, selectedPName,
    } = this.state;
    const userId = get(userDetail,'userSub') || get(userDetail, 'id');
    const serviceName = get(service, 'name');
    const serviceImg = get(service, 'image.fileUrl') || defaultImage;

    return (
      <div className="cover-bg-black z-index-high">
        <div className={s.waitListForm}>
          <div className={s.waitListInfo}>
            <div className={s.title}>
              <span>Enroll to Waitlist</span>
              <IconButton
                className={`${s.closePopupXs} simple-button`}
                color="secondary"
                onClick={this.handleCloseWaitList}
              >
                <Clear color="inherit" />
              </IconButton>
            </div>
            <div className={s.serviceImage}>
              <img src={serviceImg} alt={serviceName} className={s.imgZoomIn} width="100%" />
            </div>
            <div className={s.serviceDescription}>
              <div className={`${s.sName} ellipsis`}>{serviceName}</div>
              <div className={s.selectProvider}>
                {initProvider && (
                  <Formik
                    onSubmit={noop}
                    enableReinitialize
                    isInitialValid
                    initialValues={{
                      providerName: initProvider.selectedPName,
                      fullAddress: initProvider.fullAddress,
                      startDate: initProvider.startDate,
                      timezoneId: initProvider.timezoneId,
                    }}
                    render={({ values, isValid, setFieldValue }) => {
                      const showProvidersList = queuedProviders.length > 1;
                      const selectProviderCta = showProvidersList ? this.toggleProvidersList : noop;
                      const showLocationsList = queuedProviders[selectedPName] &&
                          queuedProviders[selectedPName].length > 1;
                      const selectLocationCta = showLocationsList ? this.toggleLocationsList : noop;
                      return (
                        <form className={s.selectedInfo}>
                          <div className={s.label}>Appointment with:</div>
                          <div className={s.dropdownList} onClick={selectProviderCta}>
                            <div className={s.inputItem}>
                              <HowToReg className="icon-small" color="secondary" />
                              <InputBase
                                fullWidth
                                name="providerName"
                                inputProps={{
                                  className: 'capitalize ellipsis',
                                }}
                                value={values.providerName}
                                disabled={!showProvidersList}
                              />
                            </div>
                            {showProvidersList && <ChevronRight />}
                          </div>
                          {isProvidersPopup && this.renderProviderList(queuedProviders, setFieldValue)}
                          <div className={s.label}>Location:</div>
                          <div className={s.dropdownList} onClick={selectLocationCta}>
                            <div className={s.inputItem}>
                              <InputBase
                                type="hidden"
                                name="fullAddress"
                                value={values.fullAddress}
                                margin="dense"
                                disabled={!showLocationsList}
                              />
                              <div className={s.providerLocation}>
                                <div className={s.inputItem}>
                                  <LocationOn className="icon-small" color="secondary" />
                                  <span>&nbsp;{limitString(values.fullAddress, ADDRESS_LENGTH)}</span>
                                </div>
                                <div className={s.inputItem}>
                                  <GpsFixed className="icon-small" color="secondary" />
                                  <span>&nbsp;{values.timezoneId}</span>
                                </div>
                              </div>
                            </div>
                            {showLocationsList && <ChevronRight />}
                          </div>
                          {isLocationsPopup && this.renderLocationList(setFieldValue)}
                          {!selectedTemporaryServiceId && (
                            <div className={s.noneTempId}>
                              <strong>Tip</strong>:
                              Please select the provider first, then location. Or change to other location.
                            </div>
                          )}
                          <div className={s.label}>Open date:</div>
                          <div className={`${s.dropdownList} gallery-bg border-none hover-none`}>
                            <div className={s.inputItem}>
                              <DateRange className="icon-small" color="secondary" />
                              <span>&nbsp;{moment(values.startDate).format(FULL_DATE)}</span>
                            </div>
                          </div>
                          <div className={s.footerCta}>
                            <Button
                              variant="outlined"
                              className={s.closePopupMd}
                              onClick={this.handleCloseWaitList}
                            >
                              <Cancel color="inherit" />
                              <span>&nbsp;Cancel</span>
                            </Button>
                            {userId && (
                              <Button
                                variant="outlined"
                                onClick={this.handleRegisterWaitList}
                                disabled={!!((!isValid && userId) || (!selectedTemporaryServiceId && userId))}
                              >
                                <WrapText color="inherit" className="icon-small" />
                                <span>&nbsp;Enroll</span>
                              </Button>
                            )}
                          </div>
                        </form>
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {!userId && (
            <div className={s.userRegistration}>
              <ClientForm userDetail={userDetail} onLogin={this.handleLogin} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  waitListProps.mapStateToProps,
  waitListProps.mapDispatchToProps,
)(WaitList);
