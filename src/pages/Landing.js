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
  };

  static defaultProps = {
  };

  state = {
    tabsInfo: {},
    activeTab: 0,
    catName: '',
    servicesByServiceCategoryId: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { categories, servicesByServiceCategoryId } = props;
    const {
      servicesByServiceCategoryId: cachedServicesByServiceCategoryId,
    } = state;
    const tabsInfo = {};
    const updatedState = {};
    if (categories.length) {
      categories.map(cat => { tabsInfo[cat.name] = []; return null; });
      categories.map(cat => tabsInfo[cat.name].push(cat));
      updatedState.categories = categories;
      updatedState.tabsInfo = tabsInfo;
    }
    if (JSON.stringify(servicesByServiceCategoryId) !== JSON.stringify(cachedServicesByServiceCategoryId)) {
      updatedState.servicesByServiceCategoryId = servicesByServiceCategoryId;
    }

    return Object.keys(updatedState).length ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchServiceCategory } = this.props;
    dispatchServiceCategory();
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
    const { activeTab, tabsInfo, servicesByServiceCategoryId, catName } = this.state;
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
  landingProps.mapStateToProps,
  landingProps.mapDispatchToProps,
)(Landing);



