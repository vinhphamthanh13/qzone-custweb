import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { limitString, navigateTo } from 'utils/common';
import { Domain, NavigateNext, NotificationImportant } from '@material-ui/icons';
import { landingProps } from 'pages/commonProps';
import { Button } from '@material-ui/core';
import s from './Service.module.scss';

class Service extends Component {
  static propTypes = {
    dispatchProvidersByServiceId: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    service: {},
    catName: '',
    providersByServiceId: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { service, catName, providersByServiceId } = props;
    const { service: cachedService, catName: cachedCatName, providersByServiceId: cachedProvidersByServiceId } = state;
    if (
      service.id !== cachedService.id
      || catName !== cachedCatName
      || providersByServiceId !== cachedProvidersByServiceId
    ) {
      return {
        service,
        catName,
        providersByServiceId,
      };
    }

    return null;
  }

  componentDidMount() {
    const { dispatchProvidersByServiceId } = this.props;
        const { service, catName } = this.state;
    dispatchProvidersByServiceId(service.id, service.name, catName);
  }

  handleSelectProvider = (sId, sName, catName )=> () => {
    navigateTo(`/provider/${sId}`, { category: catName, service: sName })();
  };

  handleSelectOrg = orgId => () => {
    navigateTo(`/organization/${orgId}`)();
  };

  render() {
    const { providersByServiceId, catName, service } = this.state;
    const sDescription = get(service, 'description');
    const sDuration = get(service, 'duration');
    const sId = get(service, 'id');
    const imgUrl = get(service, 'image.fileUrl');
    const imgAlt = get(service, 'image.originName');
    const sName = get(service, 'name');
    const orgName = get(service, 'organizationEntity.name');
    const orgId = get(service, 'organizationId');
    const serviceProviders = get(providersByServiceId, `${catName}.${sName}`) || [];
    const isProviderSelectable = serviceProviders.length > 0;

    return (
      <div className={s.card} key={sId}>
        <div className={s.image}>
          <img src={imgUrl} alt={imgAlt} width="100%" height="100%" />
          <div className={s.duration}>
            Duration: {`${sDuration}'`}
          </div>
        </div>
        <div className={s.cardContent}>
          <div className={s.cardName}>
            {sName}
          </div>
          <div className={s.description}>
            {limitString(sDescription, 150)}
          </div>
          <div className={s.footer}>
            {/* eslint-disable-next-line */}
            <div className={s.orgDescription} onClick={this.handleSelectOrg(orgId)}>
              <Domain color="inherit" />
              <span>&nbsp;{orgName}</span>
            </div>
            <div className={s.cta}>
              {isProviderSelectable && (
                <Button variant="outlined" onClick={this.handleSelectProvider(sId, sName, catName)}>
                  <NavigateNext color="inherit" />
                  Select Provider
                </Button>
              )}
              {!isProviderSelectable && (
                <div className={s.noProvider}>
                  <NotificationImportant color="inherit" />
                  <span>&nbsp;No provider found!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  landingProps.mapStateToProps,
  landingProps.mapDispatchToProps,
)(Service);
