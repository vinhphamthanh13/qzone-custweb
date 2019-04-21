import React, { Component } from 'react';
import {
  arrayOf, func, string, object, bool, oneOfType, objectOf, any,
} from 'prop-types';
import { noop, get } from 'lodash';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { setRatingService } from 'actionsReducers/common';
import { fetchProviderService, fetchProviderDetail } from 'reduxModules/provider.actions';
import Loading from 'components/Loading';
import Header from './components/Header';
import ProviderContent from './components/ProviderContent';
import ProviderService from './components/ProviderService';
import ProviderFooter from '../home/footer/Footer';
import bgImage from './images/provider-bg.png';
import s from './Provider.module.scss';

class Provider extends Component {
  componentDidMount() {
    const { fetchProviderServiceAction, fetchProviderDetailAction, id } = this.props;
    fetchProviderServiceAction(id);
    fetchProviderDetailAction(id);
  }

  render() {
    const {
      providerDetail, providerServices, isLoading, setRatingServiceAction, userDetail,
    } = this.props;
    console.log('provider details', providerDetail);
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
              {!isLoading && (
                <ProviderService
                  services={providerServices}
                  ratingService={setRatingServiceAction}
                  customerId={customerId}
                  providerId={providerId}
                />)}
            </div>
          </div>
          <ProviderFooter loading={isLoading} />
        </div>
      </>
    );
  }
}

Provider.propTypes = {
  fetchProviderServiceAction: func.isRequired,
  fetchProviderDetailAction: func.isRequired,
  id: string.isRequired,
  providerDetail: oneOfType([object]).isRequired,
  providerServices: arrayOf(object).isRequired,
  isLoading: bool.isRequired,
  setRatingServiceAction: func.isRequired,
  userDetail: objectOf(any),
};

Provider.defaultProps = {
  userDetail: {},
};

const mapStateToProps = state => ({
  providerDetail: state.providerPage.providerDetail,
  providerServices: state.providerPage.providerServices,
  isLoading: state.providerPage.isLoading,
  userDetail: state.auth.userDetail,
});

export default connect(mapStateToProps, {
  fetchProviderServiceAction: fetchProviderService,
  fetchProviderDetailAction: fetchProviderDetail,
  setRatingServiceAction: setRatingService,
})(Provider);
