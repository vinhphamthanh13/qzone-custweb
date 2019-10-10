import React, { Component } from 'react';
import { func, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Loading from 'components/Loading';
import Error from 'components/Error';
import { homeProps } from 'pages/commonProps';
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
    dispatchSetLandingPage: func.isRequired,
    match: objectOf(any).isRequired,
  };

  state = {
    searchText: '',
    searchResult: [],
    isRegisterOpen: false,
    isLoginOpen: false,
    openAdvancedSearch: false,
    showAdvancedResult: false,
    serviceCategoriesByOrgId: [],
    servicesByServiceCategoryId: [],
    categories: [],
    landingPageFactors: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { serviceCategoriesByOrgId, servicesByServiceCategoryId } = props;
    const { serviceCategoriesByOrgId: cachedServiceCategoriesByOrgId,
      servicesByServiceCategoryId: cachedServicesByServiceCategoryId,
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
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchServiceCategoriesByOrgId, match: { params: { orgRef }}, dispatchSetLandingPage } = this.props;
    if (orgRef) {
      dispatchServiceCategoriesByOrgId(orgRef);
      dispatchSetLandingPage({ orgRef });
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
    this.setState({ searchResult, searchText: value });
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

  render() {
    const {
      searchText, isRegisterOpen, isLoginOpen, openAdvancedSearch, searchResult,
      showAdvancedResult, organizations, categories, servicesByServiceCategoryId,
      landingPageFactors,
    } = this.state;
    const catName = get(landingPageFactors, 'catName');
    const enableSearch = servicesByServiceCategoryId[catName] && servicesByServiceCategoryId[catName].length > 0;

    return (
      <div className={s.landingPage}>
        <Error />
        <Loading />
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
          handleAuthenticate={this.openAuthModal}
        />
        <AppBar
          handleAuthenticate={this.openAuthModal}
          onSearch={this.handleInstantSearch}
          onSearchValue={searchText}
          toggleAdvancedSearch={this.toggleAdvancedSearch}
          enableSearch={enableSearch}
        />
        {organizations && organizations.length > 0 && (<SlideShow list={organizations} />)}
        <Landing categories={categories} handleAuth={this.openAuthModal} />
        <Footer maintenance={false} />
        {searchResult.length > 0 && (
          <div className={s.instantSearch}>
            <Services serviceList={searchResult} />
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
        {showAdvancedResult && <div />}
      </div>
    );
  }
}

export default connect(
  homeProps.mapStateToProps,
  homeProps.mapDispatchToProps,
)(Home);
