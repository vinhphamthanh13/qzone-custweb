import React from 'react';
import {
  arrayOf,
  bool,
  func,
  any,
  objectOf,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import {
  setServiceCategoriesAction,
  setServicesAction,
  setServiceProvidersAction,
} from 'actionsReducers/home.actions';
import { Grid } from '@material-ui/core';
import {
  getServicesByName,
} from 'reduxModules/home.actions';
import { history } from 'containers/App';
import Loading from 'components/Loading';
// import { matchType } from 'types/global';
import Maintenance from './home/footer/Maintenance';
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

  onChange = (value, key) => {
    this.setState({ [key]: value });
  };

  onLoadServices = () => {
    const { getServicesByNameAction } = this.props;
    const { searchText } = this.state;
    getServicesByNameAction(searchText);
  };

  getSearchedServices = (services, searchText) => services.filter(
    (service) => {
      console.log('search Service', service);
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
      serviceProviderNearByList,
    } = this.props;
    const {
      services,
      categories,
      serviceProviders,
      searchText,
      searchResult,
      isRegisterOpen,
      isLoginOpen,
      isOpenAdvancedSearch,
      isMaintenance,
      sessionTimeoutId,
      isShowingAdvancedSearch,
      selectedService,
      isOpenProfile,
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
        <BookingDialog
          initService={selectedService}
          handleClose={this.handleCloseBookingDialog}
          onSaveBooking={this.onSaveBooking}
          openDialog={this.openAuthModal}
          handleOpenProfile={this.handleOpenProfile}
        />
        <AppointmentDialog />
        <Grid container>
          <Grid item xs={12} className={s.landingPage}>
            <SlideShow
              services={combineServiceProviders}
              onBooking={this.onChange}
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
                    onChange={this.onChange}
                    onLoadServices={this.onLoadServices}
                    onCloseSearch={this.handleCloseSearch}
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
                    onChange={this.onChange}
                    onLoadServices={this.onLoadServices}
                    onCloseSearch={this.handleCloseSearch}
                  />
                </Categorize>
              )
            }
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
  getServicesByNameAction: func.isRequired,
  serviceProviderNearByList: arrayOf(any),
};

Home.defaultProps = {
  serviceProviderNearByList: [],
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
    getServicesByNameAction: getServicesByName,
  },
)(Home);
