import React, { Component } from 'react';
import { func } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { navigateTo } from 'utils/common';
import { redirectOrgProps } from 'pages/commonProps';
import { IconButton } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import s from './RedirectOrg.module.scss';

class RedirectOrg extends Component {
  static propTypes = {
    dispatchOrganizations: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    organizations: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { organizations } = props;
    const { organizations: cachedOrganizations } = state;
    const updatedState = {};
    if (
      organizations !== null &&
      JSON.stringify(organizations) !== JSON.stringify(cachedOrganizations)
    ) {
      updatedState.organizations = organizations;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchOrganizations } = this.props;
    dispatchOrganizations();
  }

  handleSelectOrgById = id => () => {
    navigateTo(`/${id}`)();
  };

  render() {
    const { organizations } = this.state;
    return (
      <div className={s.container}>
        <div className={s.orgList}>
          {organizations.map(org => {
            const logo = get(org, 'logo.fileUrl');
            const name = get(org, 'name');
            const id = get(org, 'id');
            const telephone = get(org, 'telephone');
            return (
              <div className={s.item}>
                <div className={s.orgBanner}>
                  <div className={s.logo}>
                    <img src={logo} alt={name} width="100%" />
                  </div>
                  <div className={s.orgInfo}>
                    <div className={s.orgName}>&nbsp;{name}</div>
                    <span>&nbsp;{telephone}</span>
                  </div>
                </div>
                <IconButton onClick={this.handleSelectOrgById(id)}>
                  <ChevronRight color="inherit" className="icon-big" />
                </IconButton>
              </div>
            )})}
        </div>
      </div>
    );
  }
}

export default connect(
  redirectOrgProps.mapStateToProps,
  redirectOrgProps.mapDispatchTOProps,
)(RedirectOrg);
