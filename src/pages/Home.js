import React from 'react';
import {
  arrayOf, bool, func, any, objectOf,
} from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { getServiceCategories } from 'api/home';
import { handleRequest } from 'utils/apiHelpers';
import {
  setServiceCategories,
  getServicesByName,
  setServicesGlobal,
  fetchServiceProviders,
} from 'reduxModules/home.actions';
import Loading from 'components/Loading';
import styles from './Home.module.scss';
import { serviceCategoriesType } from './home/Header';
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

/* eslint react/no-unused-state: 0 */
export class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: undefined,
      toDate: undefined,
      searchText: '',
      subCategory: undefined,
      subCategories: [],
      selectedCategoryId: '',
      selectedSubCategoryId: undefined,
      isRegisterOpen: false,
      isLoginOpen: false,
      selectedService: undefined,
      bookingDetail: undefined,
      menuIconButtonEl: null,
      userPosition: { latitude: 0, longitude: 0 },
      isOpenProfile: false,
      sessionTimeoutId: 0,
      isOpenAdvancedSearch: false,
      isShowingAdvancedSearch: false,
    };
  }

  async componentDidMount() {
    const { setServiceCategoriesAction, getAllServicesAction, fetchServiceProvidersAction } = this.props;
    const [serviceCategories] = await handleRequest(getServiceCategories, [], []);
    setServiceCategoriesAction(serviceCategories);
    getAllServicesAction();
    fetchServiceProvidersAction();
  }

  getSessionTimeoutId = (id) => {
    this.setState({ sessionTimeoutId: id });
  };

  showLocation = (position) => {
    if (!Object.is(position, null) || !Object.is(position, undefined)) {
      const { coords: { latitude, longitude } } = position;
      this.setState({ userPosition: { latitude, longitude } });
    }
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

  onCategoryChange = async (event, selectedCategoryId) => {
    const {
      serviceCategories, services, getServicesByCategoryAction,
    } = this.props;
    const { searchText } = this.state;

    const subCategories = serviceCategories.filter(
      category => category.parentCategoryId && category.parentCategoryId === selectedCategoryId,
    );

    const searchedServices = this.getSearchedServices(services, searchText, selectedCategoryId);

    if (searchedServices.length === 0) {
      getServicesByCategoryAction(selectedCategoryId);
    }

    this.setState({
      selectedCategoryId,
      selectedSubCategoryId: undefined,
      subCategories,
    });
  };

  handleCloseBookingDialog = () => {
    this.setState({ selectedService: undefined });
  };

  onSaveBooking = () => {
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
    this.setState({ isOpenProfile: false });
  };

  handleCloseSearch = () => {
    this.closeAdvancedSearchResult();
    this.setState({
      searchText: '',
    });
  };

  handleViewEventMenu = () => {
    this.handleOpenProfile();
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
      serviceCategories, isLoading, allServices, loginSession: { isAuthenticated },
      providerListByDistance, providerList,
    } = this.props;
    const {
      searchText, isRegisterOpen, isLoginOpen, isOpenAdvancedSearch,
      selectedService, isOpenProfile, sessionTimeoutId, isShowingAdvancedSearch,
    } = this.state;
    const openAuthenticatedProfile = isAuthenticated && isOpenProfile;
    const combineServiceProviders = allServices.map((service) => {
      const serviceProviders = providerList.filter(provider => provider.serviceId === service.id);
      return { ...service, linkedProvider: serviceProviders };
    });
    const catWithServices = serviceCategories.length > 0 && serviceCategories.map(cat => ({
      name: cat.name,
      list: combineServiceProviders.filter(ser => ser.serviceCategoryId === cat.id),
    }));
    const searchedServices = this.getSearchedServices(combineServiceProviders, searchText);
    const advancedSearchAvailable = providerListByDistance.length > 0 && isShowingAdvancedSearch;

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
        <Profile
          isOpenProfile={openAuthenticatedProfile}
          handleCloseProfile={this.handleCloseProfile}
        />
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
          handleChangeCategory={this.onCategoryChange}
          handleOpenProfile={this.handleOpenProfile}
          sessionTimeoutId={sessionTimeoutId}
          handleViewEvent={this.handleViewEventMenu}
          handleAdvancedSearch={this.openAdvancedSearch}
        />
        <AppointmentDialog />
        <Grid container>
          <Grid item xs={12} className={styles.selectService}>
            {allServices.length > 0 && (
              <SlideShow
                services={combineServiceProviders}
                onBooking={this.onChange}
                onSearch={this.onSearch}
                onSearchValue={searchText}
              />)}
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
            {catWithServices && catWithServices.map(category => (
              <Categorize key={category.name} name={category.name} loading={isLoading}>
                <Services
                  services={category.list}
                  onChange={this.onChange}
                  onLoadServices={this.onLoadServices}
                  isLoading={isLoading}
                />
              </Categorize>
            ))}
            <Footer loading={isLoading} />
          </Grid>
        </Grid>
      </>
    );
  }
}

Home.propTypes = {
  setServiceCategoriesAction: func.isRequired,
  getServicesByCategoryAction: func.isRequired,
  getAllServicesAction: func.isRequired,
  serviceCategories: serviceCategoriesType.isRequired,
  getServicesByNameAction: func.isRequired,
  isLoading: bool.isRequired,
  allServices: arrayOf(any).isRequired,
  loginSession: objectOf(any).isRequired,
  providerListByDistance: arrayOf(any).isRequired,
  fetchServiceProvidersAction: func.isRequired,
  providerList: arrayOf(any).isRequired,
};

const mapStateToProps = state => ({
  ...state.home,
  loginSession: state.auth.loginSession,
  isLoading: state.home.isLoading,
});

export default connect(
  mapStateToProps,
  {
    setServiceCategoriesAction: setServiceCategories,
    getServicesByNameAction: getServicesByName,
    getServicesByCategoryAction: setServicesGlobal,
    getAllServicesAction: setServicesGlobal,
    fetchServiceProvidersAction: fetchServiceProviders,
  },
)(Home);
