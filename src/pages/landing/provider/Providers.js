/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import windowSize from 'react-window-size';
import get from 'lodash/get';
import chunk from 'lodash/chunk';
import findIndex from 'lodash/findIndex';
import { IconButton, InputBase } from '@material-ui/core';
import { navigateTo } from 'utils/common';
import Loading from 'components/Loading';
import Error from 'components/Error';
import { NavigateBefore, Search, Clear } from '@material-ui/icons';
import { providersProps } from 'pages/commonProps';
import EmptyItem from 'components/EmptyItem';
import { MAX_CARD_WIDTH, SEARCH_LENGTH } from 'utils/constants';
import Footer from 'pages/components/footer/Footer';
import Provider from './Provider';
import s from './Providers.module.scss';

class Providers extends Component {
  static propTypes = {
    dispatchSelectBookingDetail: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
    dispatchQueryProvider: func.isRequired,
    dispatchClearQueriedProvider: func.isRequired,
  };

  state = {
    landingPageFactors: {},
    serviceId: '',
    bookedEventId: '',
    searchText: '',
    queriedProvider: null,
    serviceDateProviders: [],
    providersList: [],
  };

  static getDerivedStateFromProps(props, state) {
    const {
      match: { params: { sId } }, landingPageFactors, bookedEventId, windowWidth, queriedProvider,
      serviceDateProviders, providersByOrgRef,
    } = props;
    const {
      serviceId,
      windowWidth: cachedWindowWidth,
      bookedEventId: cachedBookedEventId,
      landingPageFactors: cachedLandingPageFactors,
      queriedProvider: cachedQueriedProvider,
      serviceDateProviders: cachedServiceDateProviders,
      providersByOrgRef: cachedProvidersByOrgRef,
    } = state;
    const updatedState = {};

    if (sId !== serviceId) {
      updatedState.serviceId = sId;
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
      updatedState.sName = get(landingPageFactors, 'sName', '');
      updatedState.orgRef = get(landingPageFactors, 'orgRef', '');
      updatedState.catName = get(landingPageFactors, 'catName', '');
    }
    if (
      serviceDateProviders !== null &&
      JSON.stringify(serviceDateProviders) !== JSON.stringify(cachedServiceDateProviders)
    ) {
      updatedState.serviceDateProviders = serviceDateProviders;
    }
    if (
      providersByOrgRef !== null &&
      JSON.stringify(providersByOrgRef) !== JSON.stringify(cachedProvidersByOrgRef)
    ) {
      updatedState.providersByOrgRef = providersByOrgRef;
      updatedState.providersList = providersByOrgRef[Object.keys(providersByOrgRef)[0]] || [];
    }
    if (JSON.stringify(queriedProvider) !== JSON.stringify(cachedQueriedProvider)) {
      updatedState.queriedProvider = queriedProvider;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchClearQueriedProvider } = this.props;
    dispatchClearQueriedProvider();
  }

  componentDidUpdate() {
    const { serviceId, orgRef } = this.state;
    if (serviceId === 'undefined' || !serviceId) {
      navigateTo(`/${orgRef}`)();
    }
  }

  handleSelectService = catName => () => {
    const { orgRef } = this.state;
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
    const { dispatchSelectBookingDetail, dispatchSetLandingPage } = this.props;
    const {
      searchText, serviceId, windowWidth, bookedEventId, queriedProvider, serviceDateProviders, catName, sName,
      providersList,
    } = this.state;
    const chunkFactor = Math.abs(windowWidth / MAX_CARD_WIDTH);
    const showingSearch = searchText.length > SEARCH_LENGTH && queriedProvider && queriedProvider.length > 0;
    const resolvedProvider = showingSearch ?  queriedProvider : serviceDateProviders;

    return (
      <>
        <Loading />
        <Error />
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
                {searchText.length > SEARCH_LENGTH && (
                  <Clear className="danger-color" onClick={this.handleClearSearch} />
                )}
              </form>
            </div>
          </div>
          <div className={s.bodySection}>
            {resolvedProvider.length > 0 &&
              chunk(resolvedProvider, chunkFactor).map((providerRow, ind) => (
                <div className={s.providerRow} key={ind}>
                  {providerRow.map((provider, index) => {
                    const providerId = get(provider, 'providerId');
                    const providerIndex = findIndex(providersList, item =>
                      item.id === providerId || item.userSub === providerId,
                    );
                    return (
                      <Provider
                        key={`${provider.userSub}-${index}`}
                        provider={{
                          ...provider,
                          serviceId,
                          sName,
                          catName,
                          ...providersList[providerIndex],
                        }}
                        selectBookingDetail={dispatchSelectBookingDetail}
                        bookedEventId={bookedEventId}
                        setLandingPage={dispatchSetLandingPage}
                      />);
                  })}
                </div>
              ))}
            {searchText.length > SEARCH_LENGTH && queriedProvider && queriedProvider.length === 0 && (
              <div className={s.noResultsFound}>
                <EmptyItem message="No results found for this search" className="white-color" size="lg" />
              </div>
            )}
          </div>
          <Footer maintenance={false} />
        </div>
      </>
    );
  }
}

export default connect(
  providersProps.mapStateToProps,
  providersProps.mapDispatchToProps,
)(windowSize(Providers));
