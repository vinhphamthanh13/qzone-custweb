import React, { Component } from 'react';
import { func, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import { navigateTo } from 'utils/common';
import compact from 'lodash/compact';
import Loading from 'components/Loading';
import Success from 'components/Success';
import EmptyItem from 'components/EmptyItem';
import Error from 'components/Error';
import { homeProps } from 'pages/commonProps';
import { SLIDE_TYPE } from 'utils/constants';
import Auth from './Auth';
import AppBar from './home/appBar/AppBar';
import Landing from './Landing';
import Services from './landing/service/Services';
import SlideShow from './home/slideShow/SlideShow';
import Footer from './components/footer/Footer';
import AdvancedSearch from './home/search/AdvancedSearch';
import s from './Home.module.scss';

export class Home extends Component {
  static propTypes = {
    dispatchServiceCategoriesByOrgId: func.isRequired,
    dispatchClearTempServiceDateProviderByServiceId: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
    dispatchClearProvidersByServiceId: func.isRequired,
    dispatchClearOrgNotFound: func.isRequired,
    dispatchClearBookNowList: func.isRequired,
    match: objectOf(any).isRequired,
  };

  state = {
    searchText: '',
    searchResult: null,
    isRegisterOpen: false,
    isLoginOpen: false,
    openAdvancedSearch: false,
    showAdvancedResult: false,
    serviceCategoriesByOrgId: [],
    servicesByServiceCategoryId: [],
    categories: [],
    orgNotFound: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { serviceCategoriesByOrgId, servicesByServiceCategoryId, orgNotFound } = props;
    const { serviceCategoriesByOrgId: cachedServiceCategoriesByOrgId,
      servicesByServiceCategoryId: cachedServicesByServiceCategoryId,
      orgNotFound: cachedOrgNotFound,
    } = state;
    const updatedState = {};
    if (
      serviceCategoriesByOrgId !== null &&
      JSON.stringify(serviceCategoriesByOrgId) !== JSON.stringify(cachedServiceCategoriesByOrgId)
    ) {
      updatedState.serviceCategoriesByOrgId = serviceCategoriesByOrgId;
      updatedState.categories = serviceCategoriesByOrgId.map(opt => ({ id: opt.value, name: opt.label }));
    }
    if (
      servicesByServiceCategoryId !== null &&
      JSON.stringify(servicesByServiceCategoryId) !== JSON.stringify(cachedServicesByServiceCategoryId)
    ) {
      updatedState.servicesByServiceCategoryId = servicesByServiceCategoryId;
      updatedState.enableSearch = Object.keys(servicesByServiceCategoryId).length > 0;
    }
    if (orgNotFound !== cachedOrgNotFound) {
      updatedState.orgNotFound = orgNotFound;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const {
      dispatchServiceCategoriesByOrgId,
      match: { params: { orgRef }},
      dispatchSetLandingPage,
      dispatchClearTempServiceDateProviderByServiceId,
      dispatchClearProvidersByServiceId,
      dispatchClearBookNowList,
    } = this.props;
    if (orgRef) {
      dispatchServiceCategoriesByOrgId(orgRef);
      dispatchSetLandingPage({ orgRef });
      dispatchClearTempServiceDateProviderByServiceId();
      dispatchClearProvidersByServiceId();
      dispatchClearBookNowList();
    }
  }

  componentDidUpdate(prevProps) {
    const { serviceCategoriesByOrgId } = prevProps;
    const { dispatchSetLandingPage } = this.props;
    const { serviceCategoriesByOrgId: cachedServiceCategoriesByOrgId } = this.state;
    if (
      cachedServiceCategoriesByOrgId !== null &&
      JSON.stringify(cachedServiceCategoriesByOrgId) !== JSON.stringify(serviceCategoriesByOrgId)
    ) {
      const catName = get(cachedServiceCategoriesByOrgId, '0.label');
      dispatchSetLandingPage({ catName });
    }
  }

  handleInstantSearch = (event) => {
    event.preventDefault();
    const { value } = event.target;
    const { servicesByServiceCategoryId } = this.state;
    const servicesList = [];
    Object.keys(servicesByServiceCategoryId).map(catName =>
      servicesByServiceCategoryId[catName].map(service => servicesList.push(service)));
    let searchResult = [];
    if (value.length > 2) {
      searchResult = servicesList.filter((service) => {
        const orgName = get(service, 'organizationEntity.name');
        const serviceName = get(service, 'name');
        return (
          serviceName.toLowerCase().includes(value.toLowerCase())
          || orgName.toLowerCase().includes(value.toLowerCase())
        );
      });
    }
    this.setState({
      searchResult: searchResult.length ? searchResult : null,
      searchText: value
    });
  };

  handleCloseInstantSearch = () => {
    this.setState({
      searchText: '',
      searchResult: null,
    });
  };

  openAuthModal = (key) => {
    this.setState({ [key]: true });
  };

  closeDialog = (key) => {
    this.setState({ [key]: false });
  };

  handleAdvancedResult = value => () => {
    this.setState({ showAdvancedResult: value })
  };

  toggleAdvancedSearch = (value) => () => {
    this.setState({ openAdvancedSearch: value });
  };

  handleOrgNotFound = () => {
    const { dispatchClearOrgNotFound } = this.props;
    const { orgNotFound } = this.state;
    dispatchClearOrgNotFound();
    if (orgNotFound) navigateTo('/')();
  };

  render() {
    const {
      searchText, isRegisterOpen, isLoginOpen, openAdvancedSearch, searchResult,
      showAdvancedResult, categories, servicesByServiceCategoryId, enableSearch,
    } = this.state;

    const serviceList = categories.length > 0 && categories.map(cat => {
      if (servicesByServiceCategoryId[cat.name]) {
        return [...servicesByServiceCategoryId[cat.name]]
      }
      return null;
    });

    return (
      <div className={s.landingPage}>
        {searchText.length > 2 && (
          <div className={s.instantSearch}>
            {searchResult !== null ? (
              <>
                <Services serviceList={searchResult} />
              </>
            ) : <EmptyItem message="No Service found!" />}
          </div>
        )}
        {openAdvancedSearch && (
          <div className="flex auto-margin-horizontal cover-bg-black">
            <AdvancedSearch
              handleResult={this.handleAdvancedResult}
              onClose={this.toggleAdvancedSearch}
            />
          </div>)
        }
        {showAdvancedResult && <div />} { /* TODO: Advanced search display */ }
        <Error resetOtherStatus={this.handleOrgNotFound} />
        <Loading />
        <Success />
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
          handleAuthenticate={this.openAuthModal}
        />
        <AppBar
          handleAuthenticate={this.openAuthModal}
          onSearch={this.handleInstantSearch}
          onCloseSearch={this.handleCloseInstantSearch}
          onSearchValue={searchText}
          toggleAdvancedSearch={this.toggleAdvancedSearch}
          enableSearch={enableSearch}
        />
        {serviceList && serviceList.length > 0 && (
          <SlideShow list={compact(flatten(serviceList))} type={SLIDE_TYPE.SER} />
        )}
        <Landing categories={categories} handleAuth={this.openAuthModal} />
        <Footer maintenance={false} />
      </div>
  );
  }
}

export default connect(
  homeProps.mapStateToProps,
  homeProps.mapDispatchToProps,
)(Home);
