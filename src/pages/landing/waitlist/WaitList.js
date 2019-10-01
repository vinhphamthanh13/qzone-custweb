/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { func } from 'prop-types';
import { Button, InputBase, IconButton } from '@material-ui/core';
import { ChevronRight, LocationOn, WrapText, Cancel, Fingerprint, HowToReg } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { get, noop, isEmpty } from 'lodash';
import { WAIT_LIST_KEYS } from 'utils/constants';
import defaultImage from 'images/providers.jpg';
import { waitListProps } from 'pages/commonProps';
import s from './WaitList.module.scss';

class WaitList extends Component {
  static propTypes = {
    handleAuth: func.isRequired,
    onClose: func.isRequired,
    dispatchWaitListTemporaryServicesByServiceId: func.isRequired,
  };

  state = {
    service: {},
    queuedProviders: [],
    userDetail: {},
    loginSession: {},
    [WAIT_LIST_KEYS.SELECTED_PID]: '',
    [WAIT_LIST_KEYS.SELECTED_P_NAME]: '',
    [WAIT_LIST_KEYS.SELECTED_LOC_ID]: '',
    [WAIT_LIST_KEYS.SELECTED_TEMP_SERVICE_ID]: '',
    queuedTemporaryServiceIds: {},
    isProvidersPopup: false,
    isLocationsPopup: false,
    initProvider: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { service, loginSession, userDetail, waitListTemporaryServicesByServiceId } = props;
    const {
      selectedPId: cachedSelectedPId, selectedLocId: cachedSelectedLocId, selectedPName: cachedSelectedPName,
      selectedTemporaryServiceId: cachedSelectedTemporaryServiceId,
      service: cachedService,
      loginSession: cachedLoginSession,
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
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      updatedState.loginSession = loginSession;
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
        const selectedTemporaryServiceId = get(item, 'id');
        if (!cachedSelectedPId) updatedState.selectedPId = selectedPId;
        if (!cachedSelectedPName) updatedState.selectedPName = selectedPName;
        if (!cachedSelectedLocId) updatedState.selectedLocId = selectedLocId;
        if (!cachedSelectedTemporaryServiceId) updatedState.selectedTemporaryServiceId = selectedTemporaryServiceId;
        queuedProviders[selectedPName] = queuedProviders[selectedPName] ? queuedProviders[selectedPName] : [];
        queuedProviders[selectedPName].push(
          {selectedPName, selectedPId, selectedLocId, selectedTemporaryServiceId, fullAddress },
        );
        queuedTemporaryServiceIds[`${selectedPId}-${selectedLocId}`] = selectedTemporaryServiceId;
        return null;
      });
      updatedState.queuedProviders = queuedProviders;
      updatedState.queuedTemporaryServiceIds = queuedTemporaryServiceIds;
      console.log('queuqueue', queuedProviders);
      console.log('Object.keys(queuedProviders)', Object.keys(queuedProviders));
      updatedState.initProvider = !isEmpty(queuedProviders) && queuedProviders[Object.keys(queuedProviders)[0]][0];
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchWaitListTemporaryServicesByServiceId } = this.props;
    const { service } = this.state;
    dispatchWaitListTemporaryServicesByServiceId(service.id);

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
      loginSession, queuedTemporaryServiceIds, selectedLocId, selectedPId, selectedTemporaryServiceId,
    } = this.state;
    console.log(
      'register waitList; ', loginSession, queuedTemporaryServiceIds, selectedLocId, selectedPId,
      selectedTemporaryServiceId);
    // const {
    //   // setWaitListsValidationAction: setWaitListsValidation,
    //   registerWaitListsAction: registerWaitLists,
    // } = this.props;
    // const {
    //   customerId,
    //   dateFrom,
    //   dateTo,
    //   temporaryServiceIds,
    // } = this.state;
    //
    // const startSec = dateFrom + 1; // Plus one second for startSec
    // const toSec = dateTo + 3600 * 24; // Plus one day
    // const waitListData = temporaryServiceIds.map(id => ({
    //   customerId,
    //   startSec,
    //   tempServiceId: id,
    //   toSec,
    // }));
    // registerWaitLists(waitListData);
    // this.handleToggleRegister();
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
    console.log('item selected provider', item);
    const { queuedTemporaryServiceIds, selectedLocId } = this.state;
    setFieldValue('providerName', item[WAIT_LIST_KEYS.SELECTED_P_NAME]);
    this.setState({
      [WAIT_LIST_KEYS.SELECTED_P_NAME]: item[WAIT_LIST_KEYS.SELECTED_P_NAME],
      [WAIT_LIST_KEYS.SELECTED_PID]: item[WAIT_LIST_KEYS.SELECTED_PID],
      [WAIT_LIST_KEYS.SELECTED_TEMP_SERVICE_ID]: queuedTemporaryServiceIds[
        `${item[WAIT_LIST_KEYS.SELECTED_PID]}-${selectedLocId}`
        ] || '',
    });
  };

  handleSelectLocation = (item, setFieldValue) => () => {
    const { queuedTemporaryServiceIds, selectedPId } = this.state;
    setFieldValue('fullAddress', item.fullAddress);
    this.setState({
      [WAIT_LIST_KEYS.SELECTED_LOC_ID]: item[WAIT_LIST_KEYS.SELECTED_LOC_ID],
      [WAIT_LIST_KEYS.SELECTED_TEMP_SERVICE_ID]: queuedTemporaryServiceIds[
        `${selectedPId}-${item[WAIT_LIST_KEYS.SELECTED_LOC_ID]}`
        ] || '',
    });
  };

  renderProviderList = (list, setFieldValue) => (
    <div className={s.itemList}>
      {Object.keys(list).map((name) => {
        console.log('providerName: ', name);
        console.log('providerName detail: ', list[name]);
        return (
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
        );
      })}
    </div>
  );

  renderLocationList = setFieldValue => {
    const { queuedProviders, selectedPName } = this.state;
    console.log('trigger render location list', queuedProviders[selectedPName]);
    return (<div className={s.itemList}>
      {queuedProviders[selectedPName].map(item => (
        <div
          key={uuidv1()}
          className={s.item}
          onClick={this.handleSelectLocation(item, setFieldValue)}
        >
          {item.fullAddress}
        </div>
      ))

      }
    </div>);
  };

  render() {
    const { onClose } = this.props;
    const {
      service, isProvidersPopup, isLocationsPopup, userDetail, queuedProviders, initProvider,
      selectedTemporaryServiceId,
    } = this.state;
    const userId = get(userDetail,'userSub') || get(userDetail, 'id');
    const [RegIcon, registerLabel] = userId ? [WrapText, 'Enroll'] : [Fingerprint, 'Login'];
    const serviceName = get(service, 'name');
    const serviceImg = get(service, 'image.fileUrl') || defaultImage;
    console.log('this.state', this.state);

    return (
      <div className="cover-bg-black z-index-highest">
        <div className={s.waitListForm}>
          <div className={s.title}>
            <span>Enroll to Waitlist</span>
            <IconButton color="secondary" onClick={onClose}>
              <Cancel color="inherit" />
            </IconButton>
          </div>
          <div className={s.serviceImage}>
            <img src={serviceImg} alt={serviceName} className={s.serviceImage} />
          </div>
          <div className={s.serviceDescription}>
            <div className={`${s.sName} ellipsis`}>{serviceName}</div>
            <div className={s.selectProvider}>
              {initProvider && (
                <Formik
                  onSubmit={noop}
                  isInitialValid
                  initialValues={{
                    providerName: 'select provider',
                    fullAddress: 'select location',
                  }}
                  render={({ values, isValid, setFieldValue }) => (
                    <form className={s.selectedInfo}>
                      <div className={s.label}>Appointment with:</div>
                      <div className={s.dropdownList} onClick={this.toggleProvidersList}>
                        <div className={s.inputItem}>
                          <HowToReg className="icon-small" color="secondary" />
                          <InputBase
                            fullWidth
                            name="providerName"
                            inputProps={{
                              className: 'capitalize ellipsis',
                            }}
                            value={values.providerName} />
                        </div>
                        <ChevronRight />
                        {isProvidersPopup && this.renderProviderList(queuedProviders, setFieldValue)}
                      </div>
                      <div className={s.label}>Location:</div>
                      <div className={s.dropdownList} onClick={this.toggleLocationsList}>
                        <div className={s.inputItem}>
                          <LocationOn className="icon-small" color="secondary" />
                          <InputBase
                            fullWidth
                            name="fullAddress"
                            inputProps={{
                              className: 'capitalize ellipsis',
                            }}
                            value={values.fullAddress}
                          />
                        </div>
                        <ChevronRight />
                        {isLocationsPopup && this.renderLocationList(setFieldValue)}
                      </div>
                      {!selectedTemporaryServiceId && (
                        <div className={s.noneTempId}>
                          <strong>Tip</strong>:
                          Please select the provider first, then location. Or change to other location.
                        </div>)}
                      <div className={s.footerCta}>
                        <Button
                          variant="outlined"
                          onClick={this.handleRegisterWaitList}
                          disabled={!isValid || !selectedTemporaryServiceId}
                        >
                          <RegIcon color="inherit" />
                          <span>{registerLabel}</span>
                        </Button>
                      </div>
                    </form>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  waitListProps.mapStateToProps,
  waitListProps.mapDispatchToProps,
)(WaitList);
