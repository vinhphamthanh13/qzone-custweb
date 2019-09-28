/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import windowSize from 'react-window-size';
import { get, find, uniqBy, chunk, flatten } from 'lodash';
import { IconButton } from '@material-ui/core';
import { navigateTo, getLocationState } from 'utils/common';
import { NavigateBefore } from '@material-ui/icons';
import { providersProps } from 'pages/commonProps';
import { MAX_CARD_WIDTH } from 'utils/constants';
import Provider from './Provider';
import s from './Providers.module.scss';

class Providers extends Component {
  static propTypes = {
    location: objectOf(any),
    dispatchTemporaryServicesByServiceId: func.isRequired,
    dispatchAvailabilities: func.isRequired,
    dispatchSelectBookingDetail: func.isRequired,
  };

  static defaultProps = {
    location: {},
  };

  state = {
    catName: '',
    serviceName: '',
    providersByServiceId: {},
    temporaryServiceByServiceIds: {},
    serviceId: '',
    availabilitiesByTemporaryServiceId: {},
    bookedEventId: '',
  };

  static getDerivedStateFromProps(props, state) {
    const {
      providersByServiceId, temporaryServiceByServiceIds, match: { params: { sId } },
      availabilitiesByTemporaryServiceId, bookedEventId, windowWidth,
    } = props;
    const {
      providersByServiceId: cachedProvidersByServiceId,
      temporaryServiceByServiceIds: cachedTemporaryServiceByServiceIds,
      serviceId,
      availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
      windowWidth: cachedWindowWidth,
      bookedEventId: cachedBookedEventId,
    } = state;
    const updatedState = {};
    if (
      providersByServiceId !== null &&
      JSON.stringify(providersByServiceId) !== JSON.stringify(cachedProvidersByServiceId)
    ) {
      updatedState.providersByServiceId = providersByServiceId;
    }
    if (
      temporaryServiceByServiceIds !== null &&
      JSON.stringify(temporaryServiceByServiceIds) !== JSON.stringify(cachedTemporaryServiceByServiceIds)
    ) {
      updatedState.temporaryServiceByServiceIds = temporaryServiceByServiceIds;
    }
    if (sId !== serviceId) {
      updatedState.serviceId = sId;
    }
    if (
      availabilitiesByTemporaryServiceId !== null &&
      JSON.stringify(availabilitiesByTemporaryServiceId) !== JSON.stringify(cachedAvailabilitiesByTemporaryServiceId)
    ) {
      updatedState.availabilitiesByTemporaryServiceId = availabilitiesByTemporaryServiceId;
    }
    if (windowWidth !== cachedWindowWidth) {
      updatedState.windowWidth = windowWidth;
    }
    if (
      bookedEventId !== null &&
      JSON.stringify(bookedEventId) !== JSON.stringify(cachedBookedEventId)
    ) {
      updatedState.bookedEventId = bookedEventId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { location, dispatchTemporaryServicesByServiceId } = this.props;
    const { serviceId } = this.state;
    const catName = getLocationState(location, 'category');
    const serviceName = getLocationState(location, 'service');
    dispatchTemporaryServicesByServiceId(serviceId);
    this.setState({
      catName,
      serviceName,
    });
  }

  handleSelectService = catName => () => {
    navigateTo('/', { catName })();
  };

  render() {
    const { dispatchAvailabilities, dispatchSelectBookingDetail } = this.props;
    const {
      providersByServiceId, catName, serviceName, temporaryServiceByServiceIds,
      serviceId, availabilitiesByTemporaryServiceId, windowWidth, bookedEventId,
    } = this.state;
    const providers = get(providersByServiceId, `${catName}.${serviceName}`, []);
    const providerByLocation = {};
    if (Object.keys(temporaryServiceByServiceIds).length > 0 && temporaryServiceByServiceIds[serviceId].length) {
      temporaryServiceByServiceIds[serviceId].map(item => {
        const locationId = get(item, 'geoLocation.id');
        const providerId = get(item, 'providerId');
        const providerDetail = find(providers, ['userSub', providerId]);
        providerByLocation[locationId] = providerByLocation[locationId] ? [...providerByLocation[locationId]] : [];
        providerByLocation[locationId].push({
          temporaryServiceId: item.id,
          ...providerDetail,
          ...item,
        });
        return providerByLocation;
      });
    }
    const temporaryServiceByProvider = {};
    if (Object.keys(providerByLocation).length) {
      Object.keys(providerByLocation).map(locationId => providerByLocation[locationId].map(
        provider => {
          const providerId = get(provider, 'userSub');
          temporaryServiceByProvider[providerId] = temporaryServiceByProvider[providerId]
            ? temporaryServiceByProvider[providerId] : [];
          temporaryServiceByProvider[providerId].push(provider.temporaryServiceId);
          return temporaryServiceByProvider;
        })
      );
    }
    const chunkFactor = Math.abs(windowWidth / MAX_CARD_WIDTH);
    const providerList = Object.keys(providerByLocation).map(locId =>
      uniqBy(providerByLocation[locId], 'userSub').map(provider => provider));
    const providerFlatten = flatten(providerList);

    return Object.keys(providerByLocation).length > 0 && (
      <div className={s.container}>
        <div className={s.headline}>
          <div className={s.navigation}>
            <IconButton color="inherit" onClick={this.handleSelectService(catName)}>
              <NavigateBefore color="inherit" />
            </IconButton>
          </div>
          <div className={`${s.title} ellipsis`}>
            {serviceName}
          </div>
        </div>
        {chunk(providerFlatten, chunkFactor).map((providerRow, ind) => (
          <div className={s.providerRow} key={ind}>
            {providerRow.map((provider, index) => (
              <Provider
                key={`${provider.userSub}-${index}`}
                provider={{
                  ...provider,
                  temporaryServiceId: temporaryServiceByProvider[provider.userSub],
                  catName,
                }}
                dispatchAvailabilities={dispatchAvailabilities}
                availabilitiesByTemporaryServiceId={availabilitiesByTemporaryServiceId}
                selectBookingDetail={dispatchSelectBookingDetail}
                bookedEventId={bookedEventId}
            />))}
          </div>
        ))}
      </div>
    );
  }
}

export default connect(
  providersProps.mapStateToProps,
  providersProps.mapDispatchToProps,
)(windowSize(Providers));
