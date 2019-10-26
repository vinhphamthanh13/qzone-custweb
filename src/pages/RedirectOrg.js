import React, { Component } from 'react';
import { func } from 'prop-types';
import windowSize from 'react-window-size';
import get from 'lodash/get';
import chunk from 'lodash/chunk';
import compact from 'lodash/compact';
import { connect } from 'react-redux';
import { navigateTo, limitString } from 'utils/common';
import { redirectOrgProps } from 'pages/commonProps';
import { InputBase } from '@material-ui/core';
import { Search, PhoneIphone, Clear } from '@material-ui/icons';
import Loading from 'components/Loading';
import Error from 'components/Error';
import defaultImage from 'images/providers.jpg';
import SlideShow from 'pages/home/slideShow/SlideShow';
import qLogo from 'images/quezone-logo.png';
import defaultLogo from 'images/logo.png';
import { MAX_CARD_WIDTH, SLIDE_TYPE } from 'utils/constants';
import s from './RedirectOrg.module.scss';

class RedirectOrg extends Component {
  static propTypes = {
    dispatchOrganizations: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
    dispatchClearServicesByServiceCategoryId: func.isRequired,
    dispatchClearServiceCategoriesByOrgId: func.isRequired,
    dispatchClearTempServiceDateProviderByServiceId: func.isRequired,
  };

  state = {
    organizations: [],
    windowWidth: 0,
    searchOrgList: [],
    searchText: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { organizations, windowWidth } = props;
    const { organizations: cachedOrganizations, windowWidth: cachedWindowWidth } = state;
    const updatedState = {};
    if (
      organizations !== null &&
      JSON.stringify(organizations) !== JSON.stringify(cachedOrganizations)
    ) {
      updatedState.organizations = organizations;
    }
    if (windowWidth !== cachedWindowWidth) {
      updatedState.windowWidth = windowWidth;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const {
      dispatchOrganizations,
      dispatchClearServicesByServiceCategoryId,
      dispatchClearServiceCategoriesByOrgId,
      dispatchSetLandingPage,
      dispatchClearTempServiceDateProviderByServiceId,
    } = this.props;
    dispatchClearServicesByServiceCategoryId();
    dispatchClearServiceCategoriesByOrgId();
    dispatchSetLandingPage(null);
    dispatchOrganizations();
    dispatchClearTempServiceDateProviderByServiceId();
  }

  handleSelectOrgById = org => () => {
    const { dispatchSetLandingPage } = this.props;
    const orgRef = get(org, 'orgRef');
    navigateTo(`/${orgRef}`)();
    dispatchSetLandingPage({ selectedOrg: org });
  };

  handleSearch = event => {
    if (event) event.preventDefault();
    const { organizations } = this.state;
    const { value } = event.target;
    let searchOrgList = [];
    if (value && `${value}`.length > 1) {
      searchOrgList = organizations.filter(org => {
        const orgName = get(org, 'name', '').toLowerCase();
        return orgName.includes(value.toLowerCase()) ? org.name : null;
      });
    } else {
      searchOrgList = [...organizations];
    }
    this.setState({
      searchText: value,
      searchOrgList,
    });
  };

  handleClearSearchText = () => {
    this.setState({
      searchText: '',
      searchOrgList: [],
    });
  };

  render() {
    const { organizations, searchText, windowWidth, searchOrgList } = this.state;
    const chunkFactor = windowWidth / MAX_CARD_WIDTH;
    const recommendOrg = (searchText || compact(searchOrgList).length > 0) ? [...searchOrgList] : [...organizations];
    const enableSearch = organizations.length > 0;

    return (
      <>
        <Loading />
        <Error />
        <div className={s.container}>
          <div className={s.header}>
            <div className={s.brandNameMob}>
              <img src={defaultLogo} alt="Quezone" width="100%" />
            </div>
            <div className={s.brandName}>
              <img src={qLogo} alt="Quezone" width="100%" />
            </div>
            <div className={s.searchBox}>
              <InputBase
                name="searchOrg"
                value={searchText}
                onChange={this.handleSearch}
                placeholder="Search Organization"
                disabled={!enableSearch}
              />
              <Search className={`main-color ${s.searchIcon}`} />
              {`${searchText}`.length > 1 && (
                <Clear
                  color="secondary"
                  className={s.clearSearch}
                  onClick={this.handleClearSearchText}
                />
              )}
            </div>
          </div>
          <SlideShow list={organizations} type={SLIDE_TYPE.ORG} />
          {recommendOrg.length > 0 ? (
            <>
              <div className={s.orgListHeading}>Recommend for you</div>
              <div className={s.orgList}>
                {chunk(recommendOrg, chunkFactor).map(row => (
                  <div key={Math.random()} className={s.orgRow}>
                    {row.map(org => {
                      const logo = get(org, 'logo.fileUrl') || defaultLogo;
                      const advPic = get(org, 'advPic.fileUrl') || defaultImage;
                      const name = get(org, 'name');
                      const id = get(org, 'id');
                      const telephone = get(org, 'telephone');
                      const orgDesc = get(org, 'description');

                      return (
                        // eslint-disable-next-line
                        <div key={id} className={s.item} onClick={this.handleSelectOrgById(org)}>
                          <div className={s.orgImage}>
                            <img src={advPic} alt={name} width="100%" height="100%" />
                          </div>
                          <div className={s.orgInfo}>
                            <div className={s.orgInfo}>
                              <div className={s.orgName}>{name}</div>
                              <div className={s.orgPhone}>
                                <PhoneIphone className="icon-small" color="inherit" />
                                <span>&nbsp;{telephone}</span>
                              </div>
                            </div>
                          </div>
                          <div className={s.orgIntro}>
                            <div className={s.logo}>
                              <img src={logo} alt={name} width="100%" />
                            </div>
                            <div className={s.orgDescription}>
                              {limitString(orgDesc, 250)}
                            </div>
                          </div>
                        </div>
                      )})}
                      </div>
                  ))}
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  }
}

export default connect(
  redirectOrgProps.mapStateToProps,
  redirectOrgProps.mapDispatchToProps,
)(windowSize(RedirectOrg));
