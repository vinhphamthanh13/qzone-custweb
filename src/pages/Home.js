import React from 'react';
import {
  arrayOf,
  bool,
  func,
  any,
  objectOf,
  // object,
} from 'prop-types';
import { connect } from 'react-redux';
// import { get } from 'lodash';
import {
  setServiceCategoriesAction,
  setServicesAction,
  setServiceProvidersAction,
} from 'actionsReducers/home.actions';
import { Grid } from '@material-ui/core';
import {
  getServicesByName,
  setServicesGlobal,
  fetchServiceProviders,
  fetchServiceProviderByIdAction,
} from 'reduxModules/home.actions';
import { history } from 'containers/App';
import Loading from 'components/Loading';
// import { matchType } from 'types/global';
import Maintenance from './home/footer/Maintenance';
// import { serviceCategoriesType } from './home/Header';
import Services from './home/Services';
import BookingDialog from './home/BookingDialog';
import Auth from './Auth';
import PrimarySearchAppBar from './home/appbar/PrimarySearchAppBar';
import AppointmentDialog from './home/AppointmentDialog';
import Categorize from './home/Categorize';
import Profile from './profile/Profile';
import Footer from './home/footer/Footer';
import SlideShow from './home/slideShow/SlideShow';
import AdvancedSearch from './home/search/AdvancedSearch';
import s from './Home.module.scss';

export class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      services: null,
      serviceProviders: null,

      searchText: '',
      isRegisterOpen: false,
      isLoginOpen: false,
      selectedService: undefined,
      isOpenProfile: false,
      sessionTimeoutId: 0,
      isOpenAdvancedSearch: false,
      isShowingAdvancedSearch: false,
      isMaintenance: false,
      // isSpecialBooking: false,
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
    // if (id) {
    //   fetchServiceProviderById(id);
    //   this.setState({ isSpecialBooking: true });
    // }
    // const [serviceCategories] = await handleRequest(getServiceCategories, [], []);
    // if (serviceCategories && serviceCategories.length) {
    //   setServiceCategoriesAction(serviceCategories);
    //   getAllServicesAction();
    //   fetchServiceProvidersAction();
    // } else {
    //   this.setState({ isMaintenance: true });
    // }
  }

  static getDerivedStateFromProps(props, state) {
    const { categories, serviceProviders, services } = props;
    const {
      categories: cachedCategories,
      serviceProviders: cachedServiceProviders,
      services: cachedServices,
    } = state;
    if (categories !== cachedCategories
      || serviceProviders !== cachedServiceProviders
      || services !== cachedServices
    ) {
      return { categories, serviceProviders, services };
    }
    return null;
  }


  //
  // componentWillReceiveProps(nextProps) {
  //   const { categories, serviceProviders } = nextProps;
  //   const { isSpecialBooking } = this.state;
  //   const {
  //     serviceProviderById,
  //     allServices,
  //   } = nextProps;
  //   const specialServiceId = get(serviceProviderById, 'serviceId');
  //   const specialService = allServices.find(service => service.id === specialServiceId);
  //   if (isSpecialBooking) this.onChange(specialService, 'selectedService');
  // }

  getSessionTimeoutId = (id) => {
    this.setState({ sessionTimeoutId: id });
  };

  onChange = (value, key) => {
    this.setState({ [key]: value });
  };

  onLoadServices = () => {
    const { getServicesByNameAction } = this.props;
    const { searchText } = this.state;
    getServicesByNameAction(searchText);
  };

  onSearch = (event) => {
    if (event.key === 'Enter') {
      this.props.getServicesByNameAction(event.target.value);
    } else {
      this.setState({ searchText: event.target.value });
    }
  };

  getSearchedServices = (services, searchText) => services.filter(
    (service) => {
      const lowerSearchText = searchText ? searchText.toLowerCase() : undefined;
      return searchText
        ? service.name.toLowerCase().includes(lowerSearchText)
        || service.organization.name.toLowerCase().includes(lowerSearchText)
        : true;
    },
  );

  handleCloseBookingDialog = () => {
    this.setState({
      selectedService: undefined,
      // isSpecialBooking: false,
    },
    () => history.push('/'));
  };

  openDialog = (key) => {
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

      providerListByDistance,
    } = this.props;
    const {
      services,
      categories,
      serviceProviders,

      searchText,
      isRegisterOpen,
      isLoginOpen,
      isOpenAdvancedSearch,
      isMaintenance,
      selectedService,
      isOpenProfile,
      sessionTimeoutId,
      isShowingAdvancedSearch,
    } = this.state;
    const openAuthenticatedProfile = isAuthenticated && isOpenProfile;

    const combineServiceProviders = services.map((service) => {
      const linkedProvider = serviceProviders && serviceProviders.filter(provider => provider.serviceId === service.id);
      return { ...service, linkedProvider };
    });

    const categoriesServices = categories && categories.length > 0 && categories.map(category => ({
      name: category.name,
      list: combineServiceProviders.filter(service => service.serviceCategoryId === category.id),
    }));

    const searchedServices = this.getSearchedServices(combineServiceProviders, searchText);
    const advancedSearchAvailable = providerListByDistance.length > 0 && isShowingAdvancedSearch;

    const underInstruction = isMaintenance && (<Maintenance />);

    return (
      <>
        <Loading />
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
          handleAuthenticate={this.openDialog}
          getSessionTimeoutId={this.getSessionTimeoutId}
        />
        {isAuthenticated && (
          <Profile
            isOpenProfile={openAuthenticatedProfile}
            handleCloseProfile={this.handleCloseProfile}
          />)
        }
        <BookingDialog
          initService={selectedService}
          handleClose={this.handleCloseBookingDialog}
          onSaveBooking={this.onSaveBooking}
          openDialog={this.openDialog}
          handleOpenProfile={this.handleOpenProfile}
        />
        <PrimarySearchAppBar
          handleAuthenticate={this.openDialog}
          onSearch={this.onSearch}
          onSearchValue={searchText}
          handleOpenProfile={this.handleOpenProfile}
          sessionTimeoutId={sessionTimeoutId}
          handleAdvancedSearch={this.openAdvancedSearch}
          maintenance={isMaintenance}
        />
        <AppointmentDialog />
        <Grid container>
          <Grid item xs={12} className={s.landingPage}>
            <SlideShow
              services={combineServiceProviders}
              onBooking={this.onChange}
              onSearch={this.onSearch}
              onSearchValue={searchText}
            />
            {searchText.length > 2 && (
              <Categorize
                name="Search results"
                loading={isLoading}
                search
                onClose={this.handleCloseSearch}
              >
                <Services
                  services={searchedServices}
                  onChange={this.onChange}
                  onLoadServices={this.onLoadServices}
                  isLoading={isLoading}
                  onCloseSearch={this.handleCloseSearch}
                />
              </Categorize>)
            }
            {advancedSearchAvailable && (
              <Categorize
                name="Advanced Search Results"
                loading={isLoading}
                search
                onClose={this.handleCloseSearch}
              >
                <Services
                  services={providerListByDistance}
                  onChange={this.onChange}
                  isLoading={isLoading}
                  onLoadServices={this.onLoadServices}
                />
              </Categorize>
            )}
            {categoriesServices && categoriesServices.map(category => (
              <Categorize key={category.name} name={category.name} loading={isLoading}>
                <Services
                  services={category.list}
                  onChange={this.onChange}
                  onLoadServices={this.onLoadServices}
                  isLoading={isLoading}
                />
              </Categorize>
            ))}
            {underInstruction}
            <Footer loading={isLoading} />
          </Grid>
        </Grid>
      </>
    );
  }
}

Home.propTypes = {
  // categories: arrayOf(object),
  // services: arrayOf(object).isRequired,
  // serviceProviders: arrayOf(object),
  setServiceCategoriesAction: func.isRequired,
  setServicesAction: func.isRequired,
  setServiceProvidersAction: func.isRequired,

  // setServiceCategoriesAction: func.isRequired,
  // getAllServicesAction: func.isRequired,
  // serviceCategories: serviceCategoriesType.isRequired,
  getServicesByNameAction: func.isRequired,
  isLoading: bool.isRequired,
  // allServices: arrayOf(any).isRequired,
  loginSession: objectOf(any).isRequired,
  providerListByDistance: arrayOf(any).isRequired,
  // fetchServiceProvidersAction: func.isRequired,
  // providerList: arrayOf(any).isRequired,
  // serviceProviderById: objectOf(any),
  // match: matchType,
};

Home.defaultProps = {
  // categories: null,
  // serviceProviders: null,

  // serviceProviderById: {},
  // match: { params: {} },
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.homeNew,
  ...state.home,
  loginSession: state.auth.loginSession,
  serviceProviderById: state.home.serviceProviderById,
});

export default connect(
  mapStateToProps,
  {
    setServiceCategoriesAction,
    setServicesAction,
    setServiceProvidersAction,

    // setServiceCategoriesAction: setServiceCategories,
    getServicesByNameAction: getServicesByName,
    getServicesByCategoryAction: setServicesGlobal,
    getAllServicesAction: setServicesGlobal,
    fetchServiceProvidersAction: fetchServiceProviders,
    fetchServiceProviderByIdAction,
  },
)(Home);
