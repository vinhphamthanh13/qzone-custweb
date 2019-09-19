import React, { Component } from 'react';
// import {
//   arrayOf,
//   object,
// } from 'prop-types';
import { get } from 'lodash';
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

  createServiceCard = service => {
    const sDescription = get(service, 'description');
    // const sDuration = get(service, 'duration');
    // const sId = get(service, 'id');
    const imgUrl = get(service, 'image.fileUrl');
    const imgAlt = get(service, 'image.originName');
    const sName = get(service, 'name');
    const orgName = get(service, 'organizationEntity.name');
    // const orgId = get(service, 'organizationId');
    return (
      <div className={s.card}>
        <div className={s.image}>
          <img src={imgUrl} alt={imgAlt} width="100%" height="100%" />
        </div>
        <div className={s.cardContent}>
          <div className={s.cardName}>
            {sName}
          </div>
          <div className={s.description}>
            {sDescription}
          </div>
          <div className={s.footer}>
            {orgName}
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
