import React, { Component } from 'react';
import {
  func,
  string,
  bool,
  objectOf,
  any,
} from 'prop-types';
import { noop, get } from 'lodash';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { setRatingService } from 'actionsReducers/common.actions';
import {
  setProviderDetailAction,
  setProviderServiceAction,
  setServiceProviderAction,
} from 'actionsReducers/provider.actions';
import Loading from 'components/Loading';
import Header from './components/Header';
import ProviderContent from './components/ProviderContent';
import ProviderService from './components/ProviderService';
import ProviderFooter from '../components/footer/Footer';
import bgImage from './images/provider-bg.png';
import s from './Provider.module.scss';

class Provider extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      providerDetail,
      providerServices,
      serviceProviders,
    } = props;
    const {
      providerDetail: cachedProviderDetail,
      providerServices: cachedProviderServices,
      serviceProviders: cachedServiceProviders,
    } = state;
    if (
      providerDetail !== cachedProviderDetail
      || providerServices !== cachedProviderServices
      || serviceProviders !== cachedServiceProviders
    ) {
      return {
        providerDetail,
        providerServices,
        serviceProviders,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      providerDetail: null,
      providerServices: null,
      serviceProviders: null,
    };
  }

  componentDidMount() {
    const {
      setProviderServiceAction: setProviderService,
      setProviderDetailAction: setProviderDetail,
      setServiceProviderAction: setServiceProvider,
      id,
    } = this.props;
    setProviderService(id);
    setProviderDetail(id);
    setServiceProvider();
  }

  render() {
    const {
      isLoading,
      setRatingServiceAction,
      userDetail,
    } = this.props;
    const {
      providerDetail,
      providerServices,
      serviceProviders,
    } = this.state;

    const providerName = get(providerDetail, 'givenName');
    const providerPhone = get(providerDetail, 'telephone');
    const providerEmail = get(providerDetail, 'email');
    const providerId = get(providerDetail, 'id');
    const providerInfo = get(providerDetail, 'providerInformation');
    const providerAvatar = get(providerInfo, 'image.fileUrl');
    const providerDescription = get(providerInfo, 'description');
    const providerQualification = get(providerInfo, 'qualifications');
    const customerId = get(userDetail, 'userSub');
    const headContact = {
      name: providerName,
      email: providerEmail,
      telephone: providerPhone,
      logo: providerAvatar,
    };

    console.log('providerServices', providerServices);
    console.log('providerDetail', providerDetail);
    return (
      <>
        <Loading />
        <div className={s.providerPage}>
          <Header login={noop} providerContact={headContact} />
          <div className={s.providerBody}>
            <ProviderContent
              description={providerDescription}
              qualifications={providerQualification}
              bgImage={bgImage}
            />
            <div className={s.providerServices}>
              <div className={s.providerCategory}>
                <Typography variant="h4" color="inherit" className="text-bold">
                  Our services
                </Typography>
              </div>
              <ProviderService
                providerServices={providerServices}
                serviceProviders={serviceProviders}
                ratingService={setRatingServiceAction}
                customerId={customerId}
                providerId={providerId}
              />
            </div>
          </div>
          <ProviderFooter loading={isLoading} />
        </div>
      </>
    );
  }
}

Provider.propTypes = {
  id: string.isRequired,
  isLoading: bool.isRequired,
  userDetail: objectOf(any),
  setProviderServiceAction: func.isRequired,
  setProviderDetailAction: func.isRequired,
  setRatingServiceAction: func.isRequired,
  setServiceProviderAction: func.isRequired,
};

Provider.defaultProps = {
  userDetail: {},
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.auth,
  ...state.provider,
});

export default connect(mapStateToProps, {
  setProviderServiceAction,
  setProviderDetailAction,
  setServiceProviderAction,
  setRatingServiceAction: setRatingService,
})(Provider);
