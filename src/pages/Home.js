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
} from 'reduxModules/home.actions';
import getLocation from 'utils/getLocation';
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
    };
  }

  async componentDidMount() {
    const { setServiceCategoriesAction, getAllServicesAction } = this.props;
    const [serviceCategories] = await handleRequest(getServiceCategories, [], []);
    setServiceCategoriesAction(serviceCategories);
    await getLocation(this.showLocation);
    getAllServicesAction();
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
    this.setState({ searchText: '' });
  };

  render() {
    const {
      serviceCategories, isLoading, allServices, loginSession: { isAuthenticated },
    } = this.props;
    const catWithServices = serviceCategories.map(cat => ({
      name: cat.name,
      list: allServices.filter(ser => ser.serviceCategoryId === cat.id),
    }));
    const {
      searchText, isRegisterOpen, isLoginOpen, userPosition,
      selectedService, isOpenProfile, sessionTimeoutId,
    } = this.state;
    const searchedServices = this.getSearchedServices(allServices, searchText);
    const openAuthenticatedProfile = isAuthenticated && isOpenProfile;

    console.log('all services', allServices);
    return (
      <>
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
          handleAuthenticate={this.openDialog}
          getSessionTimeoutId={this.getSessionTimeoutId}
        />
        <Profile isOpenProfile={false && openAuthenticatedProfile} handleCloseProfile={this.handleCloseProfile} />
        <BookingDialog
          initService={selectedService}
          handleClose={this.handleCloseBookingDialog}
          onSaveBooking={this.onSaveBooking}
          openDialog={this.openDialog}
        />
        <PrimarySearchAppBar
          handleAuthenticate={this.openDialog}
          onSearch={this.onSearch}
          onSearchValue={searchText}
          handleChangeCategory={this.onCategoryChange}
          userPosition={userPosition}
          handleOpenProfile={this.handleOpenProfile}
          sessionTimeoutId={sessionTimeoutId}
        />
        <AppointmentDialog />
        <Grid container>
          <Grid item xs={12} className={styles.selectService}>
            {allServices.length > 0 && <SlideShow services={allServices} />}
            {searchText.length > 2 && (
              <Categorize name="Search results" search>
                <Services
                  services={searchedServices}
                  onChange={this.onChange}
                  onLoadServices={this.onLoadServices}
                  isLoading={isLoading}
                  onCloseSearch={this.handleCloseSearch}
                />
              </Categorize>
            )
            }
            {catWithServices && catWithServices.map(category => (
              <Categorize
                key={category.name}
                name={category.name}
              >
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
  },
)(Home);
