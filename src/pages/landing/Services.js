import React, { Component } from 'react';
import { chunk } from 'lodash';
import windowSize from 'react-window-size';
import { MAX_CARD_WIDTH } from 'utils/constants';
import Service from './Service';
import s from './Services.module.scss';

class Services extends Component {
  state = {
    catName: '',
    serviceList: [],
    windowWidth: 1,
  };

  static getDerivedStateFromProps(props, state) {
    const { serviceList, catName, windowWidth } = props;
    const { catName: cachedCatName, windowWidth: cachedWindowWidth } = state;
    const updatedState = {};
    if (serviceList.length) {
      updatedState.serviceList = serviceList;
    }
    if (catName !== cachedCatName) {
      updatedState.catName = catName;
    }
    if (windowWidth !== cachedWindowWidth) {
      updatedState.windowWidth = windowWidth;
    }

    return Object.keys(updatedState).length ? updatedState : null;
  }

  render() {
    const { serviceList, catName, windowWidth } = this.state;
    const chunkFactor = serviceList.length > 0 ? windowWidth / MAX_CARD_WIDTH : 1;
    return (
      <div className={s.serviceContent}>
        {chunk(serviceList, chunkFactor).map(serviceRow => (
          <div className={s.serviceRow}>
            {serviceRow.map(service => <Service key={service.id} service={service} catName={catName} />)}
          </div>
        ))}
      </div>
    );
  }
}

export default windowSize(Services);
