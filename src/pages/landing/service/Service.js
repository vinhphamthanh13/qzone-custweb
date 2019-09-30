import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { get } from 'lodash';
import { limitString, navigateTo } from 'utils/common';
import { Domain, NavigateNext, NotificationImportant, WrapText } from '@material-ui/icons';
import { landingProps } from 'pages/commonProps';
import { SERVICE_MODE } from 'utils/constants';
import WaitList from '../waitlist/WaitList';
import s from './Service.module.scss';

class Service extends Component {
  static propTypes = {
    dispatchProvidersByServiceId: func.isRequired,
    dispatchTemporaryServicesByServiceId: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    service: {},
    catName: '',
    providersByServiceId: {},
    isQueuePopup: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { service, catName, providersByServiceId } = props;
    const {
      service: cachedService,
      catName: cachedCatName,
      providersByServiceId: cachedProvidersByServiceId,
    } = state;
    const updatedState = {};
    if (service.id !== cachedService.id) {
      updatedState.service = service;
    }
    if (catName !== cachedCatName) {
      updatedState.catName = catName;
    }
    if (
      providersByServiceId !== null &&
      JSON.stringify(providersByServiceId) !== JSON.stringify(cachedProvidersByServiceId)
    ) {
      updatedState.providersByServiceId = providersByServiceId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchProvidersByServiceId, dispatchTemporaryServicesByServiceId } = this.props;
        const { service, catName } = this.state;
    dispatchProvidersByServiceId(service.id, service.name, catName);
    dispatchTemporaryServicesByServiceId(service.id);
  }

  handleSelectProvider = (sId, sName, catName)=> () => {
    const { dispatchSetLandingPage } = this.props;
    dispatchSetLandingPage({ sName, catName });
    navigateTo(`/provider-by-service/${sId}`, { category: catName, service: sName })();
  };

  handleSelectOrg = website => () => {
    window.open(website);
  };

  toggleQueueModal = () => {
    this.setState(oldState => ({
    isQueuePopup:   !oldState.isQueuePopup,
    }));
  };

  render() {
    const { providersByServiceId, catName, service, isQueuePopup } = this.state;
    const sDescription = get(service, 'description');
    const sDuration = get(service, 'duration');
    const sId = get(service, 'id');
    const imgUrl = get(service, 'image.fileUrl');
    const sName = get(service, 'name');
    const orgName = get(service, 'organizationEntity.name');
    const website = get(service, 'organizationEntity.website');
    const serviceProviders = get(providersByServiceId, `${catName}.${sName}`, []);
    const isProviderSelectable = serviceProviders.length > 0;
    const mode = get(service, 'mode', '');
    const isQueuedMode = mode.toLowerCase() === SERVICE_MODE.QUEUE;

    return (
      <>
        {isQueuePopup && <WaitList onClose={this.toggleQueueModal} />}
        <div className={s.card} key={sId}>
          <div className={s.image}>
            <img src={imgUrl} alt={sName} width="100%" height="100%" />
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
                {isQueuedMode ? (
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
  landingProps.mapStateToProps,
  landingProps.mapDispatchToProps,
)(Service);
