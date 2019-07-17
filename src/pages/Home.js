import React from 'react';
import {
  func,
  bool,
  string,
  objectOf,
  any,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import uuidv1 from 'uuid/v1';
import { Grid } from '@material-ui/core';
import { history } from 'containers/App';
import Loading from 'components/Loading';
import Error from 'components/Error';
import EmptyItem from 'components/EmptyItem';
import {
  setServiceCategoriesAction,
  setServicesAction,
} from 'actionsReducers/home.actions';
import {
  setServiceProvidersAction,
} from 'actionsReducers/common.actions';
import { fetchFacebookUser } from 'authentication/actions/login';
import { regExPattern } from 'utils/constants';
import Services from './home/Services';
import Auth from './Auth';
import AppBar from './home/appBar/AppBar';
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
      facebookToken,
      userDetail,
    } = props;
    const {
      categories: cachedCategories,
      services: cachedServices,
      serviceProviders: cachedServiceProviders,
      serviceProviderNearByList: cachedServiceProviderNearByList,
      facebookToken: cachedFacebookToken,
      userDetail: cachedUserDetail,
    } = state;
    if (
      categories !== cachedCategories
      || serviceProviders !== cachedServiceProviders
      || services !== cachedServices
      || serviceProviderNearByList !== cachedServiceProviderNearByList
      || facebookToken !== cachedFacebookToken
      || userDetail !== cachedUserDetail
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
        combineServiceProviders,
        facebookToken,
        userDetail,
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
      combineServiceProviders: null,
    };
  }

  componentDidMount() {
    const {
      setServiceCategoriesAction: setServiceCategories,
      setServicesAction: setServices,
      setServiceProvidersAction: setServiceProviders,
      fetchFacebookUser: fetchFacebookUserAction,
      userDetail,
      facebookToken,
    } = this.props;
    setServiceCategories();
    setServices();
    setServiceProviders();
    console.log('component did update', facebookToken);
    console.log('component did update', userDetail);
    if (!userDetail && facebookToken) {
      fetchFacebookUserAction(facebookToken);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      isError,
      errorMessage,
      categories,
    } = prevProps;
    const {
      isError: cachedIsError,
      errorMessage: cachedErrorMessage,
    } = this.props;
    const {
      serviceProviders,
      categories: cachedCategories,
    } = this.state;

    if (
      (isError !== cachedIsError
      && errorMessage !== cachedErrorMessage
      && regExPattern.connectError.test(cachedErrorMessage))
      || (serviceProviders && serviceProviders.length === 0)
      || ((categories !== cachedCategories) && (!cachedCategories))
    ) {
      history.replace(`/in-maintenance/${uuidv1()}`);
    }
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
      sessionTimeoutId,
      combineServiceProviders,
    } = this.state;

    const categoriesServices = categories && categories.length > 0 && categories.map(category => ({
      name: category.name,
      services: combineServiceProviders
        && combineServiceProviders.filter(service => service.serviceCategoryId === category.id),
    }));
    const systemMaintenance = !combineServiceProviders
      || (combineServiceProviders && combineServiceProviders.length === 0);

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
        <AppBar
          handleAuthenticate={this.openAuthModal}
          onSearch={this.handleOnSearch}
          onSearchValue={searchText}
          handleAdvancedSearch={this.openAdvancedSearch}
          sessionTimeoutId={sessionTimeoutId}
          maintenance={systemMaintenance}
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
            {
              systemMaintenance ? <EmptyItem message="There is no service available at the moment" /> : (
                <>
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
                          handleAuth={this.openAuthModal}
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
                          handleAuth={this.openAuthModal}
                        />
                      </Categorize>
                    )
                  }
                  {categoriesServices
                    && categoriesServices.map(category => category.services.length > 0 && (
                      <Categorize key={category.name} name={category.name}>
                        <Services
                          services={category.services}
                          onBooking={this.handleBooking}
                          handleAuth={this.openAuthModal}
                        />
                      </Categorize>
                    ))}
                </>
              )
            }
            <Footer maintenance={systemMaintenance} />
          </Grid>
        </Grid>
      </>
    );
  }
}

Home.propTypes = {
  isError: bool,
  errorMessage: string,
  setServiceCategoriesAction: func.isRequired,
  setServicesAction: func.isRequired,
  setServiceProvidersAction: func.isRequired,
  fetchFacebookUser: func.isRequired,
  facebookToken: string,
  userDetail: objectOf(any),
};

Home.defaultProps = {
  isError: false,
  errorMessage: '',
  facebookToken: null,
  userDetail: null,
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
    fetchFacebookUser,
  },
)(Home);
