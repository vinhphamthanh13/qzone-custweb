import React, { Component } from 'react';
import {
  arrayOf, func, string, object, bool,
} from 'prop-types';
import { noop } from 'lodash';
import { connect } from 'react-redux';
import { fetchProvider } from 'reduxModules/provider.actions';
import Loading from 'components/Loading';
import Header from './components/Header';
import s from './Provider.module.scss';

class Provider extends Component {
  componentDidMount() {
    const { fetchProviderAction, id } = this.props;
    fetchProviderAction(id);
  }

  render() {
    const { providerDetail, isLoading } = this.props;
    console.log('providerDetail', providerDetail);
    return (
      <>
        <Loading />
        <div className={s.providerPage}>
          <Header login={noop} />
          <div className={s.services}>
            {!isLoading && providerDetail.map(provider => (
              <div className={s.serviceDetail}>
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
  fetchProviderAction: func.isRequired,
  id: string.isRequired,
  providerDetail: arrayOf(object).isRequired,
  isLoading: bool.isRequired,
};

const mapStateToProps = state => ({
  providerDetail: state.providerPage.providerDetail,
});

export default connect(mapStateToProps, {
  fetchProviderAction: fetchProvider,
})(Provider);
