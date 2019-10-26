/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import windowSize from 'react-window-size';
import get from 'lodash/get';
import chunk from 'lodash/chunk';
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
  };

  static getDerivedStateFromProps(props, state) {
    const {
      match: { params: { sId } }, landingPageFactors, bookedEventId, windowWidth, queriedProvider,
      serviceDateProviders,
    } = props;
    const {
      serviceId,
      windowWidth: cachedWindowWidth,
      bookedEventId: cachedBookedEventId,
      landingPageFactors: cachedLandingPageFactors,
      queriedProvider: cachedQueriedProvider,
      serviceDateProviders: cachedServiceDateProviders,
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
    }
    if (
      serviceDateProviders !== null &&
      JSON.stringify(serviceDateProviders) !== JSON.stringify(cachedServiceDateProviders)
    ) {
      updatedState.serviceDateProviders = serviceDateProviders;
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
    const { dispatchSelectBookingDetail, dispatchSetLandingPage } = this.props;
    const {
      landingPageFactors, searchText, serviceId, windowWidth, bookedEventId, queriedProvider,
      serviceDateProviders,
    } = this.state;
    const catName = get(landingPageFactors, 'catName');
    const sName = get(landingPageFactors, 'sName');
    const chunkFactor = Math.abs(windowWidth / MAX_CARD_WIDTH);
    console.log('queriedProvider', queriedProvider);

    return serviceDateProviders.length > 0 && (
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
          {chunk(serviceDateProviders, chunkFactor).map((providerRow, ind) => (
            <div className={s.providerRow} key={ind}>
              {providerRow.map((provider, index) => (
                <Provider
                  key={`${provider.userSub}-${index}`}
                  provider={{
                    ...provider,
                    serviceId,
                    sName,
                    catName,
                  }}
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
