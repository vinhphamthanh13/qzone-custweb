import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import './Home.scss';
import { getServiceCategories } from 'api/home';
import { handleResponse, handleRequest } from 'api/helpers';
import {
  setServiceCategories, getServicesByCategory, getServicesByName,
} from 'modules/home.actions';
import { serviceType } from 'types/global';
import CategoryTabs, { serviceCategoriesType } from './home/CategoryTabs';
import Services from './home/Services';
import BookingDialog from './home/BookingDialog';

/* eslint react/no-unused-state: 0 */
export class Home extends React.PureComponent {
  static propTypes = {
    setServiceCategoriesAction: PropTypes.func.isRequired,
    getServicesByCategoryAction: PropTypes.func.isRequired,
    services: PropTypes.arrayOf(serviceType).isRequired,
    serviceCategories: serviceCategoriesType.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getServicesByNameAction: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      fromDate: undefined,
      toDate: undefined,
      searchText: undefined,
      subCategory: undefined,
      subCategories: [],
      selectedCategoryId: false,
      selectedSubCategoryId: undefined,
      selectedService: undefined,
      bookingDetail: undefined,
      menuIconButtonEl: null,
    };
  }

  async componentDidMount() {
    const { setServiceCategoriesAction } = this.props;
    const serviceCategories = handleResponse(await handleRequest(getServiceCategories), []);
    setServiceCategoriesAction(serviceCategories);
    if (serviceCategories.length > 0) {
      this.onCategoryChange(null, serviceCategories[0].id);
    }
  }

  handleOpenMenu = (event) => {
    this.setState({ menuIconButtonEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ menuIconButtonEl: null });
  };

  onChange = (value, key) => {
    this.setState({ [key]: value });
  };

  onLoadServices = () => {
    this.props.getServicesByNameAction(this.state.searchText);
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

  render() {
    const { serviceCategories, isLoading, services } = this.props;
    const {
      selectedCategoryId, subCategories, selectedSubCategoryId, searchText,
      selectedService, menuIconButtonEl,
    } = this.state;
    const searchedServices = this.getSearchedServices(services, searchText, selectedCategoryId);

    return (
      <>
        <BookingDialog
          initService={selectedService}
          handleClose={this.handleCloseBookingDialog}
          onSaveBooking={this.onSaveBooking}
        />
        <Grid container>
          <Grid item xs={12}>
            <CategoryTabs
              serviceCategories={serviceCategories}
              value={selectedCategoryId}
              onCategoryChange={this.onCategoryChange}
              onSearch={this.onSearch}
              handleOpenMenu={this.handleOpenMenu}
              handleCloseMenu={this.handleCloseMenu}
              menuIconButtonEl={menuIconButtonEl}
            />
          </Grid>
          <Grid item xs={12} className="home__select-service">
            <Services
              services={searchedServices}
              onChange={this.onChange}
              subCategories={subCategories}
              selectedSubCategoryId={selectedSubCategoryId}
              isLoading={isLoading}
              onLoadServices={this.onLoadServices}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.home,
});

export default connect(
  mapStateToProps,
  {
    setServiceCategoriesAction: setServiceCategories,
    getServicesByCategoryAction: getServicesByCategory,
    getServicesByNameAction: getServicesByName,
  },
)(Home);
