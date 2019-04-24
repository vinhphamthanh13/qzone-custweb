import React from 'react';
import {
  bool,
  func,
  any,
  objectOf,
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
import { BOOKING } from 'utils/constants';
import { cacheData, getCachedData } from 'config/localStorage';
import Maintenance from './components/maintenance/Maintenance';
import Services from './home/Services';
import Auth from './Auth';
import PrimarySearchAppBar from './home/appbar/PrimarySearchAppBar';
import AppointmentDialog from './home/AppointmentDialog';
import Categorize from './home/Categorize';
import Profile from './profile/Profile';
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
      return {
        categories,
        services,
        serviceProviders,
        serviceProviderNearByList,
        eventList,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      services: null,
      serviceProviders: null,
      searchText: '',
      searchResult: null,
      isRegisterOpen: false,
      isLoginOpen: false,
      isOpenProfile: false,
      sessionTimeoutId: 0,
      isOpenAdvancedSearch: false,
      isShowingAdvancedSearch: false,
      isMaintenance: false,
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
      const { services } = this.state;
      searchResult = services.filter((service) => {
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
    const { serviceProviders } = this.state;
    const serviceId = get(service, 'id');
    const providers = serviceProviders.filter(provider => provider.serviceId === serviceId);
    history.push(`/booking/${serviceId}`);
    const cachedData = getCachedData(BOOKING.CACHE_DATA);
    const cachedServiceId = get(cachedData, 'service.id');
    if (!cachedData || cachedServiceId !== serviceId) {
      cacheData(BOOKING.CACHE_DATA, { service, providers });
    }
  };

  openAuthModal = (key) => {
    this.setState({ [key]: true });
  };

  closeDialog = (key) => {
    this.setState({ [key]: false });
  };

  handleOpenProfile = () => {
    this.setState({ isOpenProfile: true });
  };

  handleCloseProfile = () => {
    this.setState({ isOpenProfile: false }, () => history.push('/'));
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
      loginSession: { isAuthenticated },
      isLoading,
    } = this.props;
    const {
      services,
      categories,
      serviceProviders,
      isShowingAdvancedSearch,
      serviceProviderNearByList,
      searchText,
      searchResult,
      isRegisterOpen,
      isLoginOpen,
      isOpenAdvancedSearch,
      isMaintenance,
      sessionTimeoutId,
      isOpenProfile,
    } = this.state;

    const openAuthenticatedProfile = isAuthenticated && isOpenProfile;

    const combineServiceProviders = services && services.map((service) => {
      const linkedProvider = serviceProviders && serviceProviders.filter(provider => provider.serviceId === service.id);
      return { ...service, linkedProvider };
    });

    const categoriesServices = categories && categories.length > 0 && categories.map(category => ({
      name: category.name,
      services: combineServiceProviders
        && combineServiceProviders.filter(service => service.serviceCategoryId === category.id),
    }));

    const underInstruction = isMaintenance && (<Maintenance />);

    return (
      <>
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
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
          handleAuthenticate={this.openAuthModal}
          getSessionTimeoutId={this.getSessionTimeoutId}
        />
        {isAuthenticated && (
          <Profile
            isOpenProfile={openAuthenticatedProfile}
            handleCloseProfile={this.handleCloseProfile}
          />)
        }
        <AppointmentDialog />
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
                  loading={isLoading}
                  name="Search results"
                  onClose={this.handleCloseSearch}
                >
                  <Services
                    isLoading={isLoading}
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
                  loading={isLoading}
                  name="Advanced Search Results"
                  onClose={this.handleCloseSearch}
                >
                  <Services
                    isLoading={isLoading}
                    services={serviceProviderNearByList}
                    onBooking={this.handleBooking}
                  />
                </Categorize>
              )
            }
            {categoriesServices && categoriesServices.map(category => (
              <Categorize key={category.name} name={category.name} loading={isLoading}>
                <Services
                  isLoading={isLoading}
                  services={category.services}
                  onBooking={this.handleBooking}
                />
              </Categorize>
            ))}
            {underInstruction}
            <Footer loading={isLoading} />
          </Grid>
        </Grid>
        <Loading />
      </>
    );
  }
}

Home.propTypes = {
  isLoading: bool.isRequired,
  loginSession: objectOf(any).isRequired,
  setServiceCategoriesAction: func.isRequired,
  setServicesAction: func.isRequired,
  setServiceProvidersAction: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.home,
  loginSession: state.auth.loginSession,
});

export default connect(
  mapStateToProps,
  {
    setServiceCategoriesAction,
    setServicesAction,
    setServiceProvidersAction,
  },
)(Home);
