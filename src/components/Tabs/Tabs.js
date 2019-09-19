import React, { Component } from 'react';
import { func } from 'prop-types';
import { IconButton } from '@material-ui/core';
import { NavigateNext, NavigateBefore } from '@material-ui/icons';
import { chunk } from 'lodash';
import s from './Tabs.module.scss';

const TABS_CHUNK = 4;

class Tabs extends Component {
  static propTypes = {
    onSelectTab: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    tabsInfo: [],
    activeTab: 0,
    activeChunkTabs: 0,
    maxChunkCount: 0,
    chunkHistory: {},
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
    this.setState({
      maxChunkCount: chunk(Object.keys(tabsInfo), TABS_CHUNK).length,
      activeChunkTabs: 0,
      chunkHistory: {
        0: 0,
      }
    });
  }

  handleNextTab = () => {
    const { activeChunkTabs, maxChunkCount } = this.state;
    let shiftTab;
    if (activeChunkTabs < maxChunkCount - 1) {
      shiftTab = activeChunkTabs + 1;
    } else {
      shiftTab = 0;
    }
    this.setState(oldState => ({
      activeChunkTabs: shiftTab,
      ...oldState.chunkHistory,
    }));
  };

  handleSelectTab = (index, tabInfo, catName) => () => {
    const { onSelectTab } = this.props;
    const { activeChunkTabs } = this.state;
    this.setState({
      activeTab: index,
      chunkHistory: {
        [activeChunkTabs]: index,
      },
    });
    onSelectTab(index, tabInfo, catName)();
  };

  createTab = tabsInfo => {
    const { activeChunkTabs, chunkHistory } = this.state;
    const tabChunkCount = chunk(Object.keys(tabsInfo), TABS_CHUNK);
    const lazyTabs = tabChunkCount[activeChunkTabs] || [];
    return lazyTabs.length > 0 && lazyTabs.map((tab, index) => {
      const tabStyle = chunkHistory[activeChunkTabs] === index ? `${s.tab} ${s.tabActive}` : s.tab;
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
          <IconButton className={s.nextTab} onClick={this.handleNextTab}>
            <NavigateBefore color="inherit" />
          </IconButton>
          {this.createTab(tabsInfo)}
          <IconButton className={s.nextTab} onClick={this.handleNextTab}>
            <NavigateNext color="inherit" />
          </IconButton>
        </ul>
      </div>
    );
  }
}

export default Tabs;
