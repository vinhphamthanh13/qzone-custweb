import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import { get, find, uniqBy } from 'lodash';
import { IconButton } from '@material-ui/core';
import { navigateTo } from 'utils/common';
import { PhoneIphone, Email, Place, NavigateBefore } from '@material-ui/icons';
import defaultPImage from 'images/providers.jpg';
import { providersProps } from 'pages/commonProps';
import TemporaryService from './TemporaryService';
import s from './Providers.module.scss';

class Providers extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
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
    temporaryServiceByServiceIds: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { providersByServiceId, temporaryServiceByServiceIds } = props;
    const {
      providersByServiceId: cachedProvidersByServiceId,
      temporaryServiceByServiceIds: cachedTemporaryServiceByServiceIds,
    } = state;
    if (
      Object.keys(providersByServiceId).length !== Object.keys(cachedProvidersByServiceId).length
      || temporaryServiceByServiceIds.length !== cachedTemporaryServiceByServiceIds.length
    ) {
      return {
        providersByServiceId,
        temporaryServiceByServiceIds,
      };
    }
    return null;
  }

  componentDidMount() {
    const { location, match: { params: { sId } }, dispatchTemporaryServicesByServiceId } = this.props;
    const catName = get(location, 'state.category');
    const serviceName = get(location, 'state.service');
    console.log('id', this.props);
    dispatchTemporaryServicesByServiceId(sId);
    this.setState({
      catName,
      serviceName,
    });
  }

  createProviders = provider => () => {
    const { dispatchAvailabilities } = this.props;
    const pId = get(provider, 'userSub');
    const pName = get(provider, 'givenName');
    const pEmail = get(provider, 'email');
    const pPhone = get(provider, 'telephone');
    const pImage = get(provider, 'imageUrl') || defaultPImage;
    const pAddress = get(provider, 'geoLocation.fullAddress');
    const locationId = get(provider, 'geoLocation.id');
    const temporaryServiceIds = get(provider, 'temporaryServiceId');
    return (
      <div key={pId} className={s.card}>
        <div className={s.image}>
          <img src={pImage} alt="QProvider" />
        </div>
        <div className={s.content}>
          <div className={s.name}>
            {pName}
          </div>
          <div className={s.item}>
            <PhoneIphone className="icon-small" color="inherit" />
            <span>&nbsp;{pPhone}</span>
          </div>
          <div className={s.item}>
            <Email className="icon-small" color="inherit" />
            <span>&nbsp;{pEmail}</span>
          </div>
          <div className={s.place}>
            <div className={s.item}>
              <Place className="icon-small" color="secondary" />
              <span>&nbsp;{pAddress}</span>
            </div>
          </div>
        </div>
        <div className={s.availabilities}>
          <TemporaryService
            providerId={pId}
            locationId={locationId}
            fetchAvailabilities={dispatchAvailabilities}
            temporaryServiceIds={temporaryServiceIds}
          />
        </div>
      </div>
    );
  };

  render() {
    const { providersByServiceId, catName, serviceName, temporaryServiceByServiceIds } = this.state;
    const providers = get(providersByServiceId, `${catName}.${serviceName}`) || [];
    const providerByLocation = {};
    if (temporaryServiceByServiceIds.length > 0) {
      temporaryServiceByServiceIds.map(item => {
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
    // console.log('providerBylocaion', providerByLocation);
    // console.log('temporaryServiceByProvider', temporaryServiceByProvider);
    // console.log('providers', providers);
    return Object.keys(providerByLocation).length > 0 && (
      <div className={s.container}>
        <div className={s.navigation}>
          <IconButton color="inherit" onClick={navigateTo('/')}>
            <NavigateBefore color="inherit" />
          </IconButton>
        </div>
        {Object.keys(providerByLocation).map(locationId => uniqBy(providerByLocation[locationId], 'userSub').map(
          provider => this.createProviders({
            ...provider,
            temporaryServiceId: temporaryServiceByProvider[provider.userSub],
          })()))}
      </div>
    );
  }
}

export default connect(
  providersProps.mapStateToProps,
  providersProps.mapDispatchToProps,
)(Providers);
