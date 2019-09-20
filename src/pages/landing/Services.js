import React, { Component } from 'react';
// import {
//   arrayOf,
//   object,
// } from 'prop-types';
import { get } from 'lodash';
import { Button } from '@material-ui/core';
import { limitString, navigateTo } from 'utils/common';
import { Domain, NavigateNext } from '@material-ui/icons';
import s from './Services.module.scss';

class Services extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  state = {
    serviceList: [],
  };

  static getDerivedStateFromProps(props) {
    const { serviceList } = props;

    if (serviceList.length) {
      return {
        serviceList,
      };
    }

    return null;
  }

  handleSelectOrg = orgId => () => {
    navigateTo(`/organization/${orgId}`)();
  };

  handleService = sId => () => {
    console.log('serviceID', sId);
  };

  createServiceCard = service => {
    const sDescription = get(service, 'description');
    const sDuration = get(service, 'duration');
    const sId = get(service, 'id');
    const imgUrl = get(service, 'image.fileUrl');
    const imgAlt = get(service, 'image.originName');
    const sName = get(service, 'name');
    const orgName = get(service, 'organizationEntity.name');
    const orgId = get(service, 'organizationId');
    return (
      <div className={s.card} key={sId}>
        <div className={s.image}>
          <img src={imgUrl} alt={imgAlt} width="100%" height="100%" />
        </div>
        <div className={s.cardContent}>
          <div className={s.cardName}>
            {sName}
          </div>
          <div className={s.duration}>
            Duration: {`${sDuration}'`}
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
              <Button variant="outlined" onClick={this.handleService(sId)}>
                <NavigateNext color="inherit" />
                Select Provider
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { serviceList } = this.state;
    return (
      <div className={s.content}>
        {serviceList.map(service => this.createServiceCard(service))}
      </div>
    );
  }
}

export default Services;
