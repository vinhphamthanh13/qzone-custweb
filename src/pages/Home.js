import React from 'react';
import {
  arrayOf, bool, func, any,
} from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { getServiceCategories } from 'api/home';
import { handleResponse, handleRequest } from 'api/helpers';
import {
  setServiceCategories,
  getServicesByName,
  setServicesGlobal,
} from 'modules/home.actions';
import { serviceType } from 'types/global';
import getLocation from 'utils/getLocation';
import styles from './Home.module.scss';
import { serviceCategoriesType } from './home/Header';
import Services from './home/Services';
import BookingDialog from './home/BookingDialog';
import Auth from './Auth';
import PrimarySearchAppBar from './home/appbar/PrimarySearchAppBar';
import Categorize from './home/Categorize';
import Footer from './home/footer/Footer';

/* eslint react/no-unused-state: 0 */
export class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: undefined,
      toDate: undefined,
      searchText: undefined,
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
    };
  }

  async componentDidMount() {
    const { setServiceCategoriesAction, getAllServicesAction } = this.props;
    const serviceCategories = handleResponse(await handleRequest(getServiceCategories), []);
    setServiceCategoriesAction(serviceCategories);
    await getLocation(this.showLocation);
    getAllServicesAction();
  }

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

  getSearchedServices = (services, searchText, selectedCategoryId) => services.filter(
    (service) => {
      const lowerSearchText = searchText ? searchText.toLowerCase() : undefined;
      const isChosen = searchText
        ? service.name.toLowerCase().includes(lowerSearchText)
        || service.organization.name.toLowerCase().includes(lowerSearchText)
        : true;
      return !selectedCategoryId || (isChosen && service.serviceCategoryId === selectedCategoryId);
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

  render() {
    const {
      serviceCategories, isLoading, allServices,
    } = this.props;
    const catWithServices = serviceCategories.map(cat => ({
      name: cat.name,
      list: allServices.filter(ser => ser.serviceCategoryId === cat.id),
    }));
    const {
      selectedCategoryId, searchText, isRegisterOpen, isLoginOpen, userPosition,
      selectedService,
    } = this.state;
    const searchedServices = this.getSearchedServices(allServices, searchText, selectedCategoryId);
    console.log('searched services', searchedServices);
    return (
      <>
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
        />
        <BookingDialog
          initService={selectedService}
          handleClose={this.handleCloseBookingDialog}
          onSaveBooking={this.onSaveBooking}
        />
        <PrimarySearchAppBar
          handleAuthenticate={this.openDialog}
          onSearch={this.onSearch}
          categories={serviceCategories}
          handleChangeCategory={this.onCategoryChange}
          activeCategoryId={selectedCategoryId}
          userPosition={userPosition}
        />
        <Grid container>
          <Grid item xs={12} className={styles.selectService}>
            {catWithServices.length && catWithServices.map(category => (
              <Categorize
                key={category.name}
                categories={{ name: category.name }}
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
  // loginSession: objectOf(any),
  setServiceCategoriesAction: func.isRequired,
  getServicesByCategoryAction: func.isRequired,
  getAllServicesAction: func.isRequired,
  services: arrayOf(serviceType).isRequired,
  serviceCategories: serviceCategoriesType.isRequired,
  getServicesByNameAction: func.isRequired,
  isLoading: bool.isRequired,
  allServices: arrayOf(any).isRequired,
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
