import React, { Component } from 'react';
// import {
//   arrayOf,
//   object,
// } from 'prop-types';
import s from './Services.module.scss';

class Services extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  state = {
    serviceList: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { serviceList } = props;
    const { serviceList: cachedServiceList } = state;

    if (serviceList.length && serviceList.length !== cachedServiceList.length) {
      return {
        serviceList,
      };
    }

    return null;
  }

  render() {
    const { serviceList } = this.state;
    return (
      <div className={s.content}>
        {serviceList.length}
      </div>
    );
  }
}

export default Services;
