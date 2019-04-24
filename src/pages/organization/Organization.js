import React, { Component } from 'react';
import {
  func, string, object, bool, oneOfType,
} from 'prop-types';
import { noop, get } from 'lodash';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { getOrganization } from 'reduxModules/organization.actions';
import Loading from 'components/Loading';
import Header from './components/Header';
import OrgContent from './components/OrgContent';
// import OrgProvider from './components/OrgProvider';
import OrgFooter from '../components/footer/Footer';
import bgImage from './images/organization-bg.png';
import s from './Organization.module.scss';

class Organization extends Component {
  componentDidMount() {
    const { getOrganizationAction, id } = this.props;
    getOrganizationAction(id);
  }

  render() {
    const {
      organization, isLoading,
    } = this.props;
    const organizationAvatar = get(organization, 'logo.fileUrl');
    const organizationName = get(organization, 'name');
    const organizationPhone = get(organization, 'telephone');
    const headContact = {
      name: organizationName,
      telephone: organizationPhone,
      logo: organizationAvatar,
    };

    return (
      <>
        <Loading />
        <div className={s.providerPage}>
          <Header login={noop} providerContact={headContact} />
          <div className={s.providerBody}>
            <OrgContent
              description="just for test"
              qualifications="Org Qualification"
              bgImage={bgImage}
            />
            <div className={s.providerServices}>
              <div className={s.providerCategory}>
                <Typography variant="h4" color="inherit" className="text-bold">
                  Our Providers
                </Typography>
              </div>
            </div>
          </div>
          <OrgFooter loading={isLoading} />
        </div>
      </>
    );
  }
}

Organization.propTypes = {
  id: string.isRequired,
  organization: oneOfType([object]).isRequired,
  getOrganizationAction: func.isRequired,
  isLoading: bool.isRequired,
};

const mapStateToProps = state => ({
  organization: state.organization.organization,
  isLoading: state.organization.isLoading,
});

export default connect(mapStateToProps, {
  getOrganizationAction: getOrganization,
})(Organization);
