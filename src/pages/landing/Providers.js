import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import { get, find, uniqBy } from 'lodash';
import { IconButton } from '@material-ui/core';
import { navigateTo, getLocationState } from 'utils/common';
import { NavigateBefore } from '@material-ui/icons';
import { providersProps } from 'pages/commonProps';
import Provider from './Provider';
import s from './Providers.module.scss';

class Providers extends Component {
  static propTypes = {
    location: objectOf(any),
    dispatchTemporaryServicesByServiceId: func.isRequired,
    dispatchAvailabilities: func.isRequired,
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
  };

  static getDerivedStateFromProps(props, state) {
    const {
      providersByServiceId,
      temporaryServiceByServiceIds,
      match: { params: { sId } },
      availabilitiesByTemporaryServiceId
    } = props;
    const {
      providersByServiceId: cachedProvidersByServiceId,
      temporaryServiceByServiceIds: cachedTemporaryServiceByServiceIds,
      serviceId,
      availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
    } = state;
    const updatedState = {};
    if (JSON.stringify(providersByServiceId) !== JSON.stringify(cachedProvidersByServiceId)) {
      updatedState.providersByServiceId = providersByServiceId;
    }
    if (JSON.stringify(temporaryServiceByServiceIds) !== JSON.stringify(cachedTemporaryServiceByServiceIds)) {
      updatedState.temporaryServiceByServiceIds = temporaryServiceByServiceIds;
    }
    if (sId !== serviceId) {
      updatedState.serviceId = sId;
    }
    if (
      JSON.stringify(availabilitiesByTemporaryServiceId) !== JSON.stringify(cachedAvailabilitiesByTemporaryServiceId)
    ) {
      updatedState.availabilitiesByTemporaryServiceId = availabilitiesByTemporaryServiceId;
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
    const { dispatchAvailabilities } = this.props;
    const {
      providersByServiceId,
      catName,
      serviceName,
      temporaryServiceByServiceIds,
      serviceId,
      availabilitiesByTemporaryServiceId,
    } = this.state;
    const providers = get(providersByServiceId, `${catName}.${serviceName}`) || [];
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
    return Object.keys(providerByLocation).length > 0 && (
      <div className={s.container}>
        <div className={s.navigation}>
          <IconButton color="inherit" onClick={this.handleSelectService(catName)}>
            <NavigateBefore color="inherit" />
          </IconButton>
        </div>
        {Object.keys(providerByLocation).map(locationId => uniqBy(providerByLocation[locationId], 'userSub').map(
          provider => (
            <Provider
              key={provider.userSub}
              provider={{
                ...provider,
                temporaryServiceId: temporaryServiceByProvider[provider.userSub],
              }}
              dispatchAvailabilities={dispatchAvailabilities}
              availabilitiesByTemporaryServiceId={availabilitiesByTemporaryServiceId}
            />)
        ))}
      </div>
    );
  }
}

export default connect(
  providersProps.mapStateToProps,
  providersProps.mapDispatchToProps,
)(Providers);
