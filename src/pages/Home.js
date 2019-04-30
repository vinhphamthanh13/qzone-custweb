import React from 'react';
import {
  func,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Grid } from '@material-ui/core';
import { history } from 'containers/App';
import Loading from 'components/Loading';
import {
  setServiceCategoriesAction,
  setServicesAction,
  setServiceProvidersAction,
} from 'actionsReducers/home.actions';
import Error from 'components/Error';
import Maintenance from './components/maintenance/Maintenance';
import Services from './home/Services';
import Auth from './Auth';
import PrimarySearchAppBar from './home/appbar/PrimarySearchAppBar';
import Categorize from './home/Categorize';
import Footer from './components/footer/Footer';
import SlideShow from './home/slideShow/SlideShow';
import AdvancedSearch from './home/search/AdvancedSearch';
import s from './Home.module.scss';

export class Home extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    const {
      categories,
      services,
      serviceProviders,
      serviceProviderNearByList,
      eventList,
    } = props;
    const {
      categories: cachedCategories,
      services: cachedServices,
      serviceProviders: cachedServiceProviders,
      serviceProviderNearByList: cachedServiceProviderNearByList,
      eventList: cachedEventList,
    } = state;
    if (
      categories !== cachedCategories
      || serviceProviders !== cachedServiceProviders
      || services !== cachedServices
      || serviceProviderNearByList !== cachedServiceProviderNearByList
      || eventList !== cachedEventList
    ) {
      const combineServiceProviders = services && services.map((service) => {
        const linkedProvider = serviceProviders && serviceProviders
          .filter(provider => provider.serviceId === service.id);
        return { ...service, linkedProvider };
      });
      return {
        categories,
        services,
        serviceProviders,
        serviceProviderNearByList,
        eventList,
        combineServiceProviders,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      searchText: '',
      searchResult: null,
      isRegisterOpen: false,
      isLoginOpen: false,
      sessionTimeoutId: 0,
      isOpenAdvancedSearch: false,
      isShowingAdvancedSearch: false,
      isMaintenance: false,
      combineServiceProviders: null,
    };
  }

  componentDidMount() {
    const {
      setServiceCategoriesAction: setServiceCategories,
      setServicesAction: setServices,
      setServiceProvidersAction: setServiceProviders,
    } = this.props;
    setServiceCategories();
    setServices();
    setServiceProviders();
  }

  getSessionTimeoutId = (id) => {
    this.setState({ sessionTimeoutId: id });
  };

  handleOnSearch = (event) => {
    event.preventDefault();
    const { value } = event.target;
    let searchResult = null;
    if (value.length > 2) {
      const { combineServiceProviders } = this.state;
      searchResult = combineServiceProviders.filter((service) => {
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
    history.push(`/booking/${serviceId}`);
  };

  openAuthModal = (key) => {
    this.setState({ [key]: true });
  };

  closeDialog = (key) => {
    this.setState({ [key]: false });
  };

  handleCloseSearch = () => {
    this.closeAdvancedSearchResult();
    this.setState({
      searchText: '',
      searchResult: null,
    });
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
    const {
      categories,
      isShowingAdvancedSearch,
      serviceProviderNearByList,
      searchText,
      searchResult,
      isRegisterOpen,
      isLoginOpen,
      isOpenAdvancedSearch,
      isMaintenance,
      sessionTimeoutId,
      combineServiceProviders,
    } = this.state;

    const categoriesServices = categories && categories.length > 0 && categories.map(category => ({
      name: category.name,
      services: combineServiceProviders
        && combineServiceProviders.filter(service => service.serviceCategoryId === category.id),
    }));
    const underInstruction = isMaintenance && (<Maintenance />);

    return (
      <>
        <Error />
        <Loading />
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
          handleAuthenticate={this.openAuthModal}
          getSessionTimeoutId={this.getSessionTimeoutId}
        />
        <PrimarySearchAppBar
          handleAuthenticate={this.openAuthModal}
          onSearch={this.handleOnSearch}
          onSearchValue={searchText}
          handleAdvancedSearch={this.openAdvancedSearch}
          sessionTimeoutId={sessionTimeoutId}
          maintenance={isMaintenance}
          handleOpenProfile={this.handleOpenProfile}
        />
        {isOpenAdvancedSearch && (
          <div className="flex auto-margin-horizontal cover-bg-black">
            <AdvancedSearch
              onOpenResult={this.openAdvancedSearchResult}
              onCloseResult={this.closeAdvancedSearchResult}
              onClose={this.closeAdvancedSearch}
            />
          </div>)
        }
        <Grid container>
          <Grid item xs={12} className={s.landingPage}>
            <SlideShow
              services={combineServiceProviders}
              onBooking={this.handleBooking}
            />
            {
              searchResult && (
                <Categorize
                  search
                  name="Search results"
                  onClose={this.handleCloseSearch}
                >
                  <Services
                    services={searchResult}
                    onBooking={this.handleBooking}
                  />
                </Categorize>
              )
            }
            {
              isShowingAdvancedSearch && (
                <Categorize
                  search
                  name="Advanced Search Results"
                  onClose={this.handleCloseSearch}
                >
                  <Services
                    services={serviceProviderNearByList}
                    onBooking={this.handleBooking}
                  />
                </Categorize>
              )
            }
            {categoriesServices && categoriesServices.map(category => (
              <Categorize key={category.name} name={category.name}>
                <Services
                  services={category.services}
                  onBooking={this.handleBooking}
                />
              </Categorize>
            ))}
            {underInstruction}
            <Footer />
          </Grid>
        </Grid>
      </>
    );
  }
}

Home.propTypes = {
  setServiceCategoriesAction: func.isRequired,
  setServicesAction: func.isRequired,
  setServiceProvidersAction: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.home,
  ...state.auth,
});

export default connect(
  mapStateToProps,
  {
    setServiceCategoriesAction,
    setServicesAction,
    setServiceProvidersAction,
  },
)(Home);
