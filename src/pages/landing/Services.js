import React, { Component } from 'react';
import Service from './Service';
import s from './Services.module.scss';

class Services extends Component {
  state = {
    catName: '',
    serviceList: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { serviceList, catName } = props;
    const { catName: cachedCatName } = state;
    const updatedState = {};
    if (serviceList.length) {
      updatedState.serviceList = serviceList;
    }
    if (catName !== cachedCatName) {
      updatedState.catName = catName;
    }

    return Object.keys(updatedState).length ? updatedState : null;
  }

  render() {
    const { serviceList, catName } = this.state;
    return (
      <div className={s.content}>
        {serviceList.map(service => <Service key={service.id} service={service} catName={catName} />)}
      </div>
    );
  }
}

export default Services;
