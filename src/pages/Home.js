import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import './Home.scss';
import { getServiceCategories, getServices } from 'utils/api/home';
import { handleResponse } from 'utils/api/helpers';
import { setServiceCategories, setServices } from 'modules/home.actions';
import CategoryTabs, { serviceCategoriesType } from './home/CategoryTabs';
import SelectServices from './home/Services';
import { serviceType } from './home/services/ServiceCard';

class Home extends React.PureComponent {
  static propTypes = {
    setServiceCategoriesAction: PropTypes.func.isRequired,
    setServicesAction: PropTypes.func.isRequired,
    services: PropTypes.arrayOf(serviceType).isRequired,
    serviceCategories: serviceCategoriesType.isRequired,
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
      searchedServices: [],
    };
  }

  async componentDidMount() {
    const { setServiceCategoriesAction, setServicesAction } = this.props;

    const [serviceCategories, services] = (await Promise.all([
      getServiceCategories(),
      getServices(),
    ])).map(handleResponse);

    setServiceCategoriesAction(serviceCategories);
    setServicesAction(services);
  }

  onChange = (value, key) => {
    this.setState({ [key]: value });
  }

  onSubmit = () => {
    console.log(this.state);
  }

  onCategoryChange = (event, selectedCategoryId) => {
    const { serviceCategories, services } = this.props;

    const subCategories = serviceCategories.filter(
      category => category.parentCategory && category.parentCategory.id === selectedCategoryId,
    );

    const searchedServices = services.filter(service => service.serviceCategoryId === selectedCategoryId);

    this.setState({
      selectedCategoryId,
      selectedSubCategoryId: undefined,
      subCategories,
      searchedServices,
    });
  }

  render() {
    const { serviceCategories } = this.props;
    const {
      selectedCategoryId, subCategories, selectedSubCategoryId, searchedServices,
    } = this.state;

    return (
      <Grid container>
        <Grid item sm={12}>
          <CategoryTabs
            serviceCategories={serviceCategories}
            value={selectedCategoryId}
            onCategoryChange={this.onCategoryChange}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          />
        </Grid>
        <Grid item sm={12} className="home__select-service">
          <SelectServices
            services={searchedServices}
            onChange={this.onChange}
            subCategories={subCategories}
            selectedSubCategoryId={selectedSubCategoryId}
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
  { setServiceCategoriesAction: setServiceCategories, setServicesAction: setServices },
)(Home);
