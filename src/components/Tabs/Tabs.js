import React, { Component } from 'react';
import { func } from 'prop-types';
import s from './Tabs.module.scss';

class Tabs extends Component {
  static propTypes = {
    onSelectTab: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    tabsInfo: [],
    activeTab: 0,
  };

  static getDerivedStateFromProps(props, state) {
    const { tabsInfo } = props;
    const { tabsInfo: cachedTabsInfo } = state;
    if (Object.keys(tabsInfo).length && Object.keys(tabsInfo).length !== Object.keys(cachedTabsInfo).length) {
      return {
        tabsInfo,
      };
    }

    return null;
  }

  componentDidMount() {
    const { onSelectTab } = this.props;
    const { tabsInfo, activeTab } = this.state;
    const initCatName = Object.keys(tabsInfo)[0];
    const initTabInfo = tabsInfo[initCatName];
    const categoryIdList = initTabInfo.map(cat => cat.id);
    onSelectTab(activeTab, categoryIdList, initCatName)();
    console.log('Tabs', tabsInfo);
  }

  handleSelectTab = (index, tabInfo, catName) => () => {
    const { onSelectTab } = this.props;
    this.setState({
      activeTab: index,
    });
    onSelectTab(index, tabInfo, catName)();
  };

  createTab = tabsInfo => {
    const { activeTab } = this.state;
    return Object.keys(tabsInfo).map((tab, index) => {
      const tabStyle = activeTab === index ? `${s.tab} ${s.tabActive}` : s.tab;
      return (
        // eslint-disable-next-line
        <li
          key={tab}
          className={tabStyle}
          onClick={this.handleSelectTab(index, tabsInfo[tab], tab)}>
            <div className={s.tabName}>
              {tab}
            </div>
        </li>
      )
    });
  };

  render() {
    const { tabsInfo } = this.state;

    return (
      <div className={s.wrapper}>
        <ul className={s.tabs}>
          {this.createTab(tabsInfo)}
        </ul>
      </div>
    );
  }
}

export default Tabs;
