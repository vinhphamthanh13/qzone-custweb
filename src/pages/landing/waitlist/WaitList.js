/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { func } from 'prop-types';
import { Button, InputBase, IconButton } from '@material-ui/core';
import { ChevronRight, LocationOn, WrapText, Cancel, Fingerprint, HowToReg } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { get, noop } from 'lodash';
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
    [WAIT_LIST_KEYS.SELECTED_LOC_ID]: '',
    [WAIT_LIST_KEYS.SELECTED_TEMP_SERVICE_ID]: '',
    queuedTemporaryServiceIds: {},
    isProvidersPopup: false,
    isLocationsPopup: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { service, loginSession, userDetail, waitListTemporaryServicesByServiceId } = props;
    const {
      selectedPId: cachedSelectedPId, selectedLocId: cachedSelectedLocId,
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
        const pName = get(item, 'providerName');
        const selectedLocId = get(item, 'geoLocation.id');
        const fullAddress = get(item, 'geoLocation.fullAddress');
        const selectedTemporaryServiceId = get(item, 'id');
        if (!cachedSelectedPId) updatedState.selectedPId = selectedPId;
        if (!cachedSelectedLocId) updatedState.selectedLocId = selectedLocId;
        if (!cachedSelectedTemporaryServiceId) updatedState.selectedTemporaryServiceId = selectedTemporaryServiceId;
        queuedProviders[selectedPId] = queuedProviders[selectedPId] ? queuedProviders[selectedPId] : [];
        queuedProviders[selectedPId].push(
          {pName, selectedPId, selectedLocId, selectedTemporaryServiceId, fullAddress },
        );
        queuedTemporaryServiceIds[`${selectedPId}-${selectedLocId}`] = selectedTemporaryServiceId;
        return null;
      });
      updatedState.queuedProviders = queuedProviders;
      updatedState.queuedTemporaryServiceIds = queuedTemporaryServiceIds;
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

  handleSelectItem = (item, key) => () => {

    this.setState({
      [key]: item[key],
    });
  };


  renderProviderList = list => (
    <div className={s.itemList}>
      {Object.keys(list).map(id => list[id].map(item => (
        <div
          key={uuidv1()}
          className={s.item}
          onClick={this.handleSelectItem(item, WAIT_LIST_KEYS.SELECTED_PID)}
        >
          {item.pName}
        </div>
      )))}
    </div>
  );

  renderLocationList = () => {
    const { queuedProviders, selectedPId } = this.state;
    console.log('trigger render location list');
    return (<div className={s.itemList}>
      {queuedProviders[selectedPId].map(item => (
        <div
          key={uuidv1()}
          className={s.item}
          onClick={this.handleSelectItem(item, WAIT_LIST_KEYS.SELECTED_LOC_ID)}
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
      service, isProvidersPopup, isLocationsPopup, userDetail,
      queuedProviders,
    } = this.state;
    const userId = get(userDetail,'userSub') || get(userDetail, 'id');
    const [RegIcon, registerLabel] = userId ? [WrapText, 'Enroll'] : [Fingerprint, 'Login'];
    const serviceName = get(service, 'name');
    const serviceImg = get(service, 'image.fileUrl') || defaultImage;
    const initProvider = queuedProviders && queuedProviders[Object.keys(queuedProviders)[0]][0];
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
                    providerName: initProvider.pName,
                    fullAddress: initProvider.fullAddress,
                  }}
                  render={({ values, isValid }) => (
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
                        {isProvidersPopup && this.renderProviderList(queuedProviders)}
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
                        {isLocationsPopup && this.renderLocationList()}
                      </div>
                      <div className={s.footerCta}>
                        <Button
                          variant="outlined"
                          onClick={this.handleRegisterWaitList}
                          disabled={!isValid}
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
