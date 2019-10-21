/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import windowSize from 'react-window-size';
import { find, uniqBy, chunk, flatten } from 'lodash';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { IconButton, InputBase } from '@material-ui/core';
import { navigateTo } from 'utils/common';
import { NavigateBefore, Search, Clear } from '@material-ui/icons';
import { providersProps } from 'pages/commonProps';
import { MAX_CARD_WIDTH } from 'utils/constants';
import Footer from 'pages/components/footer/Footer';
import Provider from './Provider';
import s from './Providers.module.scss';

class Providers extends Component {
  static propTypes = {
    dispatchTemporaryServicesByServiceId: func.isRequired,
    dispatchAvailabilities: func.isRequired,
    dispatchSelectBookingDetail: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
    dispatchQueryProvider: func.isRequired,
    dispatchClearQueriedProvider: func.isRequired,
  };

  state = {
    providersByServiceId: {},
    temporaryServiceByServiceIds: {},
    availabilitiesByTemporaryServiceId: {},
    landingPageFactors: {},
    serviceId: '',
    bookedEventId: '',
    searchText: '',
    queriedProvider: null,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      providersByServiceId, temporaryServiceByServiceIds, match: { params: { sId } }, landingPageFactors,
      availabilitiesByTemporaryServiceId, bookedEventId, windowWidth, queriedProvider,
    } = props;
    const {
      providersByServiceId: cachedProvidersByServiceId,
      temporaryServiceByServiceIds: cachedTemporaryServiceByServiceIds,
      serviceId,
      availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
      windowWidth: cachedWindowWidth,
      bookedEventId: cachedBookedEventId,
      landingPageFactors: cachedLandingPageFactors,
      queriedProvider: cachedQueriedProvider,
    } = state;
    const updatedState = {};

    if (sId !== serviceId) {
      updatedState.serviceId = sId;
    }
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
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }
    if (JSON.stringify(queriedProvider) !== JSON.stringify(cachedQueriedProvider)) {
      updatedState.queriedProvider = queriedProvider;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchTemporaryServicesByServiceId, dispatchClearQueriedProvider } = this.props;
    const { serviceId } = this.state;
    dispatchTemporaryServicesByServiceId(serviceId);
    dispatchClearQueriedProvider();
  }

  componentDidUpdate() {
    const { serviceId, landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef');
    if (serviceId === 'undefined' || !serviceId) {
      navigateTo(`/${orgRef}`)();
    }
  }

  handleSelectService = catName => () => {
    const { landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef', '');
    navigateTo(`/${orgRef}`, { catName })();
  };

  handleSearch = event => {
    if (event) event.preventDefault();
    const { value } = event.target;
    this.setState({
      searchText: value,
    });
  };

  handleClearSearch = () => {
    const { dispatchClearQueriedProvider } = this.props;
    dispatchClearQueriedProvider();
    this.setState({
      searchText: '',
    });
  };

  handleSubmitSearch = event => {
    if (event) event.preventDefault();
    const { dispatchQueryProvider } = this.props;
    const { searchText, landingPageFactors } = this.state;
    const orgId = get(landingPageFactors, 'selectedOrg.id');
    dispatchQueryProvider({ name: searchText, orgId});
  };

  render() {
    const { dispatchAvailabilities, dispatchSelectBookingDetail, dispatchSetLandingPage } = this.props;
    const {
      providersByServiceId, temporaryServiceByServiceIds, landingPageFactors, searchText,
      serviceId, availabilitiesByTemporaryServiceId, windowWidth, bookedEventId,
      queriedProvider,
    } = this.state;
    const catName = get(landingPageFactors, 'catName');
    const sName = get(landingPageFactors, 'sName');
    const providers = (searchText && queriedProvider !== null && [...queriedProvider]) ||
      get(providersByServiceId, `${catName}.${sName}`, []);
    const providerByLocation = {};
    if (
      !isEmpty(temporaryServiceByServiceIds) &&
      Object.keys(temporaryServiceByServiceIds).length > 0 &&
      temporaryServiceByServiceIds[serviceId] &&
      temporaryServiceByServiceIds[serviceId].length
    ) {
      temporaryServiceByServiceIds[serviceId].map(item => {
        const locationId = get(item, 'geoLocation.id');
        const providerId = get(item, 'providerId');
        const providerDetail = find(providers, ['userSub', providerId]);
        if (providerDetail) {
          providerByLocation[locationId] = providerByLocation[locationId] ? [...providerByLocation[locationId]] : [];
          providerByLocation[locationId].push({
            temporaryServiceId: item.id,
            ...providerDetail,
            ...item,
          });
          return providerByLocation;
        }
        return null;
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

    return Object.keys(providerFlatten).length > 0 && (
      <div className={s.container}>
        <div className={s.topSection}>
          <div className={s.headline}>
            <div className={s.navigation}>
              <IconButton color="inherit" onClick={this.handleSelectService(catName)}>
                <NavigateBefore color="inherit" />
              </IconButton>
              <div className={`${s.title} ellipsis`}>{sName}</div>
            </div>
            <form onSubmit={this.handleSubmitSearch} className={s.searchProvider}>
              <Search className="main-color" />&nbsp;
              <InputBase fullWidth placeholder="Provider name" value={searchText} onChange={this.handleSearch} />
              {searchText.length > 2 && <Clear className="danger-color" onClick={this.handleClearSearch} />}
            </form>
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
                  setLandingPage={dispatchSetLandingPage}
                  landingPageFactors={landingPageFactors}
              />))}
            </div>
          ))}
        </div>
        <Footer maintenance={false} />
      </div>
    );
  }
}

export default connect(
  providersProps.mapStateToProps,
  providersProps.mapDispatchToProps,
)(windowSize(Providers));
