import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import './Home.scss';
import { getServiceCategories } from 'utils/api/home';
import { handleResponse } from 'utils/api/helpers';
import {
  setServiceCategories, getServicesByCategory, getServicesByName,
} from 'modules/home.actions';
import { serviceType } from 'types/global';
import CategoryTabs, { serviceCategoriesType } from './home/CategoryTabs';
import Services from './home/Services';

/* eslint react/no-unused-state: 0 */
export class Home extends React.PureComponent {
  static propTypes = {
    setServiceCategoriesAction: PropTypes.func.isRequired,
    getServicesByCategoryAction: PropTypes.func.isRequired,
    services: PropTypes.arrayOf(serviceType).isRequired,
    serviceCategories: serviceCategoriesType.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getServicesByNameAction: PropTypes.func.isRequired,
  }

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
    };
  }

  async componentDidMount() {
    const { setServiceCategoriesAction } = this.props;
    const serviceCategories = handleResponse(await getServiceCategories());
    setServiceCategoriesAction(serviceCategories);
  }

  onChange = (value, key) => {
    this.setState({ [key]: value });
  }

  onLoadServices = () => {
    this.props.getServicesByNameAction(this.state.searchText);
  }

  onSearch = (event) => {
    if (event.key === 'Enter') {
      this.props.getServicesByNameAction(event.target.value);
    } else {
      this.setState({ searchText: event.target.value });
    }
  }

  getSearchedServices = (services, searchText, selectedCategoryId) => services.filter(
    (service) => {
      const lowerSearchText = searchText.toLowerCase();
      const isChosen = searchText
        ? service.name.toLowerCase().includes(lowerSearchText)
            || service.organization.name.toLowerCase().includes(lowerSearchText)
        : true;
      return !selectedCategoryId || (isChosen && service.serviceCategoryId === selectedCategoryId);
    },
  )

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
  }

  render() {
    const { serviceCategories, isLoading, services } = this.props;
    const {
      selectedCategoryId, subCategories, selectedSubCategoryId, searchText,
    } = this.state;
    const searchedServices = this.getSearchedServices(services, searchText, selectedCategoryId);

    return (
      <Grid container>
        <Grid item sm={12}>
          <CategoryTabs
            serviceCategories={serviceCategories}
            value={selectedCategoryId}
            onCategoryChange={this.onCategoryChange}
            onSearch={this.onSearch}
          />
        </Grid>
        <Grid item sm={12} className="home__select-service">
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
