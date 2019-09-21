import React, { Component } from 'react';
import { get } from 'lodash';
import { Button } from '@material-ui/core';
import { limitString, navigateTo } from 'utils/common';
import { Domain, NavigateNext, NotificationImportant } from '@material-ui/icons';
import s from './Services.module.scss';

class Services extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  state = {
    catName: '',
    serviceList: [],
    providers: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { serviceList, providers, catName } = props;
    const { providers: cachedProviders, catName: cachedCatName } = state;

    if (
      providers.length !== cachedProviders.length ||
      serviceList.length ||
      catName !== cachedCatName
    ) {
      return {
        serviceList,
        providers,
        catName,
      };
    }

    return null;
  }

  handleSelectProvider = (sId, sName, catName )=> () => {
    navigateTo(`/provider/${sId}`, { category: catName, service: sName })();
  };

  handleSelectOrg = orgId => () => {
    navigateTo(`/organization/${orgId}`)();
  };

  createServiceCard = service => {
    const { providers, catName } = this.state;
    const sDescription = get(service, 'description');
    const sDuration = get(service, 'duration');
    const sId = get(service, 'id');
    const imgUrl = get(service, 'image.fileUrl');
    const imgAlt = get(service, 'image.originName');
    const sName = get(service, 'name');
    const orgName = get(service, 'organizationEntity.name');
    const orgId = get(service, 'organizationId');
    const serviceProviders = get(providers, `${catName}.${sName}`) || [];
    const isProviderSelectable =serviceProviders.length > 0;
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
  };

  render() {
    const { serviceList} = this.state;
    return (
      <div className={s.content}>
        {serviceList.map(service => this.createServiceCard(service))}
      </div>
    );
  }
}

export default Services;
