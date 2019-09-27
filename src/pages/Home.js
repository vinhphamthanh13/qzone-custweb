import React, { Component } from 'react';
import { func, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { navigateTo } from 'utils/common';
import Loading from 'components/Loading';
import Error from 'components/Error';
// import EmptyItem from 'components/EmptyItem';
import { homeProps } from 'pages/commonProps';
import Auth from './Auth';
import AppBar from './home/appBar/AppBar';
import Landing from './Landing';
import Services from './landing/Services';
import Footer from './components/footer/Footer';
import SlideShow from './home/slideShow/SlideShow';
import AdvancedSearch from './home/search/AdvancedSearch';
import s from './Home.module.scss';

export class Home extends Component {
  static propTypes = {
    location: objectOf(any),
  };

  static defaultProps = {
    location: {},
  };

  state = {
    servicesByServiceCategoryId: {},
    searchText: '',
    searchResult: [],
    isRegisterOpen: false,
    isLoginOpen: false,
    // isOpenAdvancedSearch: false,
    // isShowingAdvancedSearch: false,

  };

  static getDerivedStateFromProps(props, state) {
    const { servicesByServiceCategoryId } = props;
    const { servicesByServiceCategoryId: cachedServicesByServiceCategoryId } = state;
    const updatedState = {};
    if (JSON.stringify(servicesByServiceCategoryId) !== JSON.stringify(cachedServicesByServiceCategoryId)) {
      updatedState.servicesByServiceCategoryId = servicesByServiceCategoryId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }


  handleReloadApp = () => {
    const {
      dispatchServiceCategory,
      dispatchServices,
      dispatchTemporaryServices,
    } = this.props;
    dispatchServiceCategory();
    dispatchServices();
    dispatchTemporaryServices();
  };

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

  handleBooking = (service) => {
    const serviceId = get(service, 'id');
    navigateTo(`/booking/${serviceId}`)();
  };

  openAuthModal = (key) => {
    this.setState({ [key]: true });
  };

  closeDialog = (key) => {
    this.setState({ [key]: false });
  };

  handleAdvancedSearchResult = (value) => {
    this.setState({ isShowingAdvancedSearch: value });
  };

  openAdvancedSearchResult = () => {
    this.handleAdvancedSearchResult(true);
  };

  closeAdvancedSearchResult = () => {
    this.handleAdvancedSearchResult(false);
  };

  handleAdvancedSearch = (value) => {
    this.setState({ isOpenAdvancedSearch: value });
  };

  openAdvancedSearch = () => {
    this.handleAdvancedSearch(true);
  };

  closeAdvancedSearch = () => {
    this.handleAdvancedSearch(false);
  };

  render() {
    const { location } = this.props;
    const {
      searchText,
      isRegisterOpen,
      isLoginOpen,
      isOpenAdvancedSearch,
      searchResult,
      isShowingAdvancedSearch,
      servicesByServiceCategoryId,
    } = this.state;

    const servicesList = [];
    Object.keys(servicesByServiceCategoryId).map(catName =>
      servicesByServiceCategoryId[catName].map(service => servicesList.push(service)));
    console.log('searchResult', searchResult);
    console.log('isShowingAdvancedSearch', isShowingAdvancedSearch);
    return (
      <div className={s.landingPage}>
        <Error />
        <Loading />
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
          handleAuthenticate={this.openAuthModal}
          onReloadApp={this.handleReloadApp}
        />
        <AppBar
          handleAuthenticate={this.openAuthModal}
          onSearch={this.handleInstantSearch}
          onSearchValue={searchText}
          handleAdvancedSearch={this.openAdvancedSearch}
        />
        {servicesList.length > 0 && (
          <SlideShow
            services={servicesList}
          />
        )}
        <Landing location={location} />
        <Footer maintenance={false} />
        {searchResult.length > 0 && (
          <div className={s.instantSearch}>
            <Services serviceList={searchResult} />
          </div>
        )}
        {isOpenAdvancedSearch && (
          <div className="flex auto-margin-horizontal cover-bg-black">
            <AdvancedSearch
              onOpenResult={this.openAdvancedSearchResult}
              onCloseResult={this.closeAdvancedSearchResult}
              onClose={this.closeAdvancedSearch}
            />
          </div>)
        }
      </div>
    );
  }
}

Home.propTypes = {
  dispatchServiceCategory: func.isRequired,
  dispatchServices: func.isRequired,
  dispatchTemporaryServices: func.isRequired,
};

export default connect(
  homeProps.mapStateToProps,
  homeProps.mapDispatchToProps,
)(Home);
