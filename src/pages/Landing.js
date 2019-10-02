/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { landingProps } from 'pages/commonProps';
import EmptyItem from 'components/EmptyItem';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Success from 'components/Success';
import Tabs from './landing/tabs/Tabs'
import Services from './landing/service/Services';
import s from './Landing.module.scss';

class Landing extends Component {
  static propTypes = {
    dispatchServiceCategory: func.isRequired,
    dispatchServicesByServiceCategoryId: func.isRequired,
    dispatchSetTabOrder: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
    handleAuth: func.isRequired,
  };

  state = {
    tabsInfo: {},
    tabOrder: {},
    activeTab: 0,
    catName: '',
    servicesByServiceCategoryId: {},
    landingPageFactors: {},
    categories: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { categories, servicesByServiceCategoryId, tabOrder, landingPageFactors } = props;
    const {
      servicesByServiceCategoryId: cachedServicesByServiceCategoryId, tabOrder: cachedTabOrder,
      landingPageFactors: cachedLandingPageFactors, categories: cachedCategories, catName,
    } = state;
    const tabsInfo = {};
    const updatedState = {};
    if (JSON.stringify(categories) !== JSON.stringify(cachedCategories)) {
      categories.map(cat => { tabsInfo[cat.name] = []; return null; });
      categories.map(cat => tabsInfo[cat.name].push(cat));
      updatedState.categories = categories;
      updatedState.tabsInfo = tabsInfo;
      updatedState.catName = categories[0].name || catName;
    }
    if (
      servicesByServiceCategoryId !== null &&
      JSON.stringify(servicesByServiceCategoryId) !== JSON.stringify(cachedServicesByServiceCategoryId)
    ) {
      updatedState.servicesByServiceCategoryId = servicesByServiceCategoryId;
    }
    if (
      tabOrder !== null &&
      JSON.stringify(tabOrder) !== JSON.stringify(cachedTabOrder)
    ) {
      updatedState.tabOrder = tabOrder;
    }
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }

    return Object.keys(updatedState).length ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchServiceCategory, dispatchSetLandingPage } = this.props;
    dispatchServiceCategory();
    dispatchSetLandingPage({ instantBooking: false });
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatchSetLandingPage } = prevProps;
    const { tabsInfo, catName } = prevState;
    const { tabsInfo: cachedTabsInfo, catName: cachedCatName } = this.state;
    if (
      catName !== cachedCatName ||
      JSON.stringify(tabsInfo) !== JSON.stringify(cachedTabsInfo)
    ) {
      dispatchSetLandingPage({ tabsInfo: cachedTabsInfo, catName: cachedCatName });
    }
  }

  handleSelectTab = (tabInfo, catName) => () => {
    const { dispatchServicesByServiceCategoryId, dispatchSetLandingPage } = this.props;
    const { tabsInfo } = this.state;
    this.setState({
      catName,
    });
    const categoryIdList = tabInfo.map(cat => cat.id);
    dispatchServicesByServiceCategoryId(categoryIdList, catName);
    dispatchSetLandingPage({ catName, tabsInfo });
  };

  render() {
    const { dispatchSetTabOrder, handleAuth } = this.props;
    const { activeTab, servicesByServiceCategoryId, catName, tabOrder, landingPageFactors } = this.state;
    const serviceList = servicesByServiceCategoryId[catName] || [];
    const tabsInfo = get(landingPageFactors, 'tabsInfo');

    return (
      <>
        <Loading />
        <Error />
        <Success />
        <div className={s.landing}>
          {!!tabsInfo && Object.keys(tabsInfo).length > 0 && (
            <>
              <Tabs
                setTabOrder={dispatchSetTabOrder}
                tabOrder={tabOrder}
                tabsInfo={tabsInfo}
                onSelectTab={this.handleSelectTab}
              />
              {serviceList.length > 0
                ? (
                    <Services
                      serviceList={serviceList}
                      catName={catName}
                      activeTab={activeTab}
                      handleAuth={handleAuth}
                    />
                  )
                : <EmptyItem />
              }
            </>
          )}
        </div>
      </>
    )
  }

}

export default connect(
  landingProps.mapStateToProps,
  landingProps.mapDispatchToProps,
)(Landing);



