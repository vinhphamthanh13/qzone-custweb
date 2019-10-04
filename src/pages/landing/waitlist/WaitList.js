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
    dispatchRegisterWaitLists: func.isRequired,
  };

  state = {
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

  static getDerivedStateFromProps(props, state) {
    const { service, userDetail, waitListTemporaryServicesByServiceId } = props;
    const {
      selectedPId: cachedSelectedPId, selectedLocId: cachedSelectedLocId, selectedPName: cachedSelectedPName,
      selectedTemporaryServiceId: cachedSelectedTemporaryServiceId,
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
      updatedState.initProvider = !isEmpty(queuedProviders) && queuedProviders[Object.keys(queuedProviders)[0]][0];
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchWaitListTemporaryServicesByServiceId } = this.props;
    const { service } = this.state;
    dispatchWaitListTemporaryServicesByServiceId(service.id);

  }

  handleRegisterWaitList = () => {
    const { dispatchRegisterWaitLists, onClose } = this.props;
    const { selectedTemporaryServiceId, userDetail } = this.state;
    const customerId = get(userDetail, 'userSub') || get(userDetail, 'id');
    dispatchRegisterWaitLists({
      customerId, tempServiceId: selectedTemporaryServiceId, startSec: 0, toSec: 0,
    });
    onClose();
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

  handleLogin = () => {
    const { handleAuth } = this.props;
    handleAuth('isLoginOpen');
  };

  render() {
    const { onClose } = this.props;
    const {
      service, isProvidersPopup, isLocationsPopup, userDetail, queuedProviders, initProvider,
      selectedTemporaryServiceId,
    } = this.state;
    const userId = get(userDetail,'userSub') || get(userDetail, 'id');
    const [CtaIcon, ctaLabel, ctaAction] = userId
      ? [WrapText, 'Enroll', this.handleRegisterWaitList]
      : [Fingerprint, 'Login', this.handleLogin];
    const serviceName = get(service, 'name');
    const serviceImg = get(service, 'image.fileUrl') || defaultImage;

    return (
      <div className="cover-bg-black z-index-higher">
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
                  isInitialValid={false}
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
                          onClick={ctaAction}
                          disabled={!!((!isValid && userId) || (!selectedTemporaryServiceId && userId))}
                        >
                          <CtaIcon color="inherit" />
                          <span>{ctaLabel}</span>
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
