/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { landingProps } from 'pages/commonProps';
import EmptyItem from 'components/EmptyItem';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Success from 'components/Success';
import Tabs from 'components/Tabs/Tabs'
import Services from './landing/Services';
import s from './Landing.module.scss';

class Landing extends Component {
  static propTypes = {
    dispatchServiceCategory: func.isRequired,
    dispatchServicesByServiceCategoryId: func.isRequired,
    dispatchProvidersByServiceId: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    categories: [],
    tabsInfo: {},
    activeTab: 0,
    catName: '',
    servicesByServiceCategoryId: {},
    providersByServiceId: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { categories, servicesByServiceCategoryId, providersByServiceId } = props;
    const {
      categories: cachedCategories,
      servicesByServiceCategoryId: cachedServicesByServiceCategoryId,
      providersByServiceId: cachedProvidersByServiceId,
    } = state;
    const tabsInfo = {};
    if (
      categories.length && categories.length !== cachedCategories.length
      || (Object.keys(servicesByServiceCategoryId).length
      && Object.keys(servicesByServiceCategoryId).length !== Object.keys(cachedServicesByServiceCategoryId).length)
      || (Object.keys(providersByServiceId).length
      && Object.keys(providersByServiceId).length !== Object.keys(cachedProvidersByServiceId).length)
    ) {
      categories.map(cat => { tabsInfo[cat.name] = []; return null; });
      categories.map(cat => tabsInfo[cat.name].push(cat));
      return {
        categories,
        tabsInfo,
        servicesByServiceCategoryId,
        providersByServiceId,
      }
    }

    return null;
  }

  componentDidMount() {
    const { dispatchServiceCategory } = this.props;
    dispatchServiceCategory();
  }

  componentDidUpdate(prevProps) {
    const { servicesByServiceCategoryId, dispatchProvidersByServiceId } = prevProps;
    const { servicesByServiceCategoryId: cachedServicesByServiceCategoryId, catName } = this.state;

    if (
      Object.keys(cachedServicesByServiceCategoryId).length > 0 &&
      Object.keys(servicesByServiceCategoryId).length !== Object.keys(cachedServicesByServiceCategoryId).length
    ) {
      const serviceList = cachedServicesByServiceCategoryId[catName] || [];
      serviceList.map(item => dispatchProvidersByServiceId(item.id, item.name, catName));
    }
  }

  handleSelectTab = (index, tabInfo, catName) => () => {
    const { dispatchServicesByServiceCategoryId } = this.props;
    this.setState({
      activeTab: index,
      catName,
    });
    const categoryIdList = tabInfo.map(cat => cat.id);
    dispatchServicesByServiceCategoryId(categoryIdList, catName);
  };

  render() {
    // const { dispatchProvidersByServiceId } = this.props;
    const { activeTab, tabsInfo, servicesByServiceCategoryId, catName, providersByServiceId } = this.state;
    const serviceList = servicesByServiceCategoryId[catName] || [];
    return (
      <>
        <Loading />
        <Error />
        <Success />
        <div className={s.landing}>
          {Object.keys(tabsInfo).length > 0 && (
            <>
              <Tabs
                tabsInfo={tabsInfo}
                onSelectTab={this.handleSelectTab}
              />
              {serviceList.length > 0
                ? (
                    <Services
                      serviceList={serviceList}
                      providers={providersByServiceId}
                      catName={catName}
                      activeTab={activeTab}
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
  landingProps.mapStateTopProps,
  landingProps.mapDispatchToProps,
)(Landing);



