import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { get } from 'lodash';
import { limitString, navigateTo } from 'utils/common';
import { Domain, NavigateNext, NotificationImportant, WrapText } from '@material-ui/icons';
import { serviceProps } from 'pages/commonProps';
import { SERVICE_MODE } from 'utils/constants';
import defaultImage from 'images/providers.jpg';
import WaitList from '../waitlist/WaitList';
import s from './Service.module.scss';

class Service extends Component {
  static propTypes = {
    dispatchProvidersByServiceId: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
    handleAuth: func.isRequired,
  };

  state = {
    service: {},
    providersByServiceId: {},
    isQueuePopup: false,
    landingPageFactors: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { service, providersByServiceId, landingPageFactors } = props;
    const {
      service: cachedService,
      providersByServiceId: cachedProvidersByServiceId,
      landingPageFactors: cachedLandingPageFactors,
    } = state;
    const updatedState = {};
    if (service.id !== cachedService.id) {
      updatedState.service = service;
    }
    if (
      providersByServiceId !== null &&
      JSON.stringify(providersByServiceId) !== JSON.stringify(cachedProvidersByServiceId)
    ) {
      updatedState.providersByServiceId = providersByServiceId;
    }
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchProvidersByServiceId } = this.props;
    const { service, landingPageFactors } = this.state;
    const catName = get(landingPageFactors, 'catName');
    dispatchProvidersByServiceId(service.id, service.name, catName);
  }

  handleSelectProvider = (sId, sName, catName)=> () => {
    const { dispatchSetLandingPage } = this.props;
    const { landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef', '');
    dispatchSetLandingPage({ sName, catName });
    navigateTo(`/${orgRef}/provider-by-service/${sId}`, { category: catName, service: sName })();
  };

  handleSelectOrg = website => () => {
    window.open(website);
  };

  toggleQueueModal = () => {
    this.setState(oldState => ({
    isQueuePopup: !oldState.isQueuePopup,
    }));
  };

  render() {
    const { handleAuth } = this.props;
    const { providersByServiceId, landingPageFactors, service, isQueuePopup } = this.state;
    const catName = get(landingPageFactors, 'catName');
    const sDescription = get(service, 'description');
    const sDuration = get(service, 'duration');
    const sId = get(service, 'id');
    const imgUrl = get(service, 'image.fileUrl') || defaultImage;
    const sName = get(service, 'name');
    const orgName = get(service, 'organizationEntity.name');
    const website = get(service, 'organizationEntity.website');
    const serviceProviders = get(providersByServiceId, `${catName}.${sName}`, []);
    const isProviderSelectable = serviceProviders.length > 0;
    const mode = get(service, 'mode', '');
    const isQueuedMode = mode.toLowerCase() === SERVICE_MODE.QUEUE;

    return (
      <>
        {isQueuePopup && <WaitList service={service} onClose={this.toggleQueueModal} handleAuth={handleAuth} />}
        <div className={s.card} key={sId}>
          <div className={s.image}>
            <img src={imgUrl} alt={sName} className={s.zoomImg} width="100%" height="100%" />
            <div className={s.duration}>
              Duration: {`${sDuration}'`}
            </div>
          </div>
          <div className={s.cardContent}>
            <div className={`${s.cardName} ellipsis`}>
              {sName}
            </div>
            <div className={s.description}>
              {limitString(sDescription, 150)}
            </div>
            <div className={s.footer}>
              {/* eslint-disable-next-line */}
              <div className={s.orgDescription} onClick={this.handleSelectOrg(website)}>
                <Domain color="inherit" />
                <span className="ellipsis">&nbsp;{orgName}</span>
              </div>
              <div className={s.cta}>
                {isProviderSelectable && isQueuedMode ? (
                  <div className={s.queueMode}>
                    <Button variant="outlined" color="inherit" onClick={this.toggleQueueModal}>
                      <WrapText colo="inherit" />
                      <span>&nbsp;Join Queue</span>
                    </Button>
                  </div>
                ) : (
                  <div className={s.scheduleMode}>
                    {isProviderSelectable && (
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={this.handleSelectProvider(sId, sName, catName)}
                      >
                        <NavigateNext color="inherit" />
                        Select Provider
                      </Button>
                    )}
                    {!isProviderSelectable && (
                      <div className={s.noProvider}>
                        <NotificationImportant color="inherit" />
                        <span>&nbsp;No provider available!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  serviceProps.mapStateToProps,
  serviceProps.mapDispatchToProps,
)(Service);
