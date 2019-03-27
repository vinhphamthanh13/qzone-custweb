import React, { Component } from 'react';
import {
  arrayOf, func, string, object, bool, oneOfType,
} from 'prop-types';
import { noop, get } from 'lodash';
import { connect } from 'react-redux';
import uuidv1 from 'uuid/v1';
import { fetchProviderService, fetchProviderDetail } from 'reduxModules/provider.actions';
import Loading from 'components/Loading';
import logo from 'images/logo.png';
import Header from './components/Header';
import ProviderContent from './components/ProviderContent';
import bgImage from './images/service-queue.jpg';
import s from './Provider.module.scss';

class Provider extends Component {
  componentDidMount() {
    const { fetchProviderServiceAction, fetchProviderDetailAction, id } = this.props;
    fetchProviderServiceAction(id);
    fetchProviderDetailAction(id);
  }

  render() {
    const { providerDetail, providerServices, isLoading } = this.props;
    console.log('providerDetail', providerDetail);
    const providerName = get(providerDetail, 'givenName');
    const providerPhone = get(providerDetail, 'telephone');
    const providerEmail = get(providerDetail, 'email');
    const headContact = {
      name: providerName,
      email: providerEmail,
      telephone: providerPhone,
      logo,
    };
    const providerInfo = get(providerDetail, 'providerInformation');
    const providerDescription = get(providerInfo, 'description');
    const providerQualification = get(providerInfo, 'qualifications');

    return (
      <>
        <Loading />
        <div className={s.providerPage}>
          <Header login={noop} providerContact={headContact} />
          <ProviderContent
            description={providerDescription}
            qualifications={providerQualification}
            bgImage={bgImage}
          />
          <div className={s.providerInfo}>
            discription
          </div>
          <div className={s.services}>
            {!isLoading && providerServices.map(provider => (
              <div key={uuidv1()} className={s.serviceDetail}>
                {provider.name}
              </div>
            ))}
          </div>
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
};

const mapStateToProps = state => ({
  providerDetail: state.providerPage.providerDetail,
  providerServices: state.providerPage.providerServices,
});

export default connect(mapStateToProps, {
  fetchProviderServiceAction: fetchProviderService,
  fetchProviderDetailAction: fetchProviderDetail,
})(Provider);
