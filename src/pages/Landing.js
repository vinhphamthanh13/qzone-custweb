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
    categories: [],
    tabs: {},
    activeTab: 0,
    catName: '',
    servicesByServiceCategoryId: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { categories, servicesByServiceCategoryId } = props;
    const {
      categories: cachedCategories,
      servicesByServiceCategoryId: cachedServicesByServiceCategoryId,
    } = state;
    const tabs = {};
    if (
      categories.length && categories.length !== cachedCategories.length
      || (Object.keys(servicesByServiceCategoryId).length
      && Object.keys(servicesByServiceCategoryId).length !== Object.keys(cachedServicesByServiceCategoryId).length)
    ) {
      categories.map(cat => { tabs[cat.name] = []; return null; });
      categories.map(cat => tabs[cat.name].push(cat));
      return {
        categories,
        tabs,
        servicesByServiceCategoryId,
      }
    }

    return null;
  }

  componentDidMount() {
    const { dispatchServiceCategory } = this.props;
    dispatchServiceCategory();
  }

  handleSelectTab = (index, tabInfo, catName) => () => {
    const { dispatchServicesByServiceCategoryId } = this.props;
    const { activeTab } = this.state;
    this.setState({
      activeTab: index,
      catName,
    });
    const categoryIdList = tabInfo.map(cat => cat.id);
    if (activeTab !== index) {
      dispatchServicesByServiceCategoryId(categoryIdList, catName);
    }
  };

  render() {
    const { tabs, categories, servicesByServiceCategoryId, catName } = this.state;
    console.log('categories', categories);
    const serviceList = servicesByServiceCategoryId[catName] || [];
    console.log('serviceList', serviceList);
    return (
      <>
        <Loading />
        <Error />
        <Success />
        <div className={s.landing}>
          {Object.keys(tabs).length > 0 && (
            <>
              <Tabs
                tabsInfo={tabs}
                onSelectTab={this.handleSelectTab}
              />
              {serviceList.length > 0
                ? <Services serviceList={serviceList} />
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



