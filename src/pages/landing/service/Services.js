import React, { Component } from 'react';
import { func } from 'prop-types';
import { chunk } from 'lodash';
import windowSize from 'react-window-size';
import { MAX_CARD_WIDTH } from 'utils/constants';
import Service from './Service';
import s from './Services.module.scss';

class Services extends Component {
  static propTypes = {
    handleAuth: func.isRequired,
  };

  state = {
    serviceList: [],
    windowWidth: 1,
  };

  static getDerivedStateFromProps(props, state) {
    const { serviceList, windowWidth } = props;
    const { windowWidth: cachedWindowWidth } = state;
    const updatedState = {};
    if (serviceList.length) {
      updatedState.serviceList = serviceList;
    }
    if (windowWidth !== cachedWindowWidth) {
      updatedState.windowWidth = windowWidth;
    }

    return Object.keys(updatedState).length ? updatedState : null;
  }

  render() {
    const { handleAuth } = this.props;
    const { serviceList, windowWidth } = this.state;
    const chunkFactor = serviceList.length > 0 ? windowWidth / MAX_CARD_WIDTH : 1;
    return (
      <>
        {chunk(serviceList, chunkFactor).map((serviceRow, index) => (
          // eslint-disable-next-line
          <div className={s.serviceRow} key={index}>
            {serviceRow.map(service => (
              <Service
                key={service.id}
                service={service}
                handleAuth={handleAuth}
              />
            )
            )}
          </div>
        ))}
      </>
    );
  }
}

export default windowSize(Services);
