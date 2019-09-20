import React, { Component } from 'react';
import { func } from 'prop-types';
import windowSize from 'react-window-size';
import { IconButton } from '@material-ui/core';
import { NavigateNext, NavigateBefore } from '@material-ui/icons';
import { chunk } from 'lodash';
import { MAX_TAB_WIDTH } from 'utils/constants';
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
    activeChunkTabs: 0,
    maxChunkCount: 0,
    chunkHistory: {},
    windowWidth: 0,
  };

  static getDerivedStateFromProps(props, state) {
    const { tabsInfo, windowWidth } = props;
    const {
      tabsInfo: cachedTabsInfo,
      windowWidth: cachedWidth,
    } = state;
    if (
      Object.keys(tabsInfo).length && Object.keys(tabsInfo).length !== Object.keys(cachedTabsInfo).length
      || windowWidth !== cachedWidth
    ) {
      return {
        tabsInfo,
        windowWidth,
      };
    }

    return null;
  }

  componentDidMount() {
    const { onSelectTab } = this.props;
    const { tabsInfo, activeTab, windowWidth } = this.state;
    const initCatName = Object.keys(tabsInfo)[0];
    const initTabInfo = tabsInfo[initCatName];
    const categoryIdList = initTabInfo.map(cat => cat.id);
    onSelectTab(activeTab, categoryIdList, initCatName)();
    const chunkFactor = Math.abs(windowWidth / (MAX_TAB_WIDTH + 96));
    this.setState({
      maxChunkCount: chunk(Object.keys(tabsInfo), chunkFactor).length,
      activeChunkTabs: 0,
      chunkFactor,
      chunkHistory: {
        0: 0,
      }
    });
  }

  handleNextTab = value => () => {
    const { activeChunkTabs, maxChunkCount } = this.state;
    let shiftTab;
    if (
      value > 0 && activeChunkTabs < maxChunkCount - 1 ||
      value < 0 && activeChunkTabs > 0
    ) {
      shiftTab = activeChunkTabs + value;
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
    const { chunkFactor } = this.state;
    const { activeChunkTabs, chunkHistory } = this.state;
    const tabChunkCount = chunk(Object.keys(tabsInfo), chunkFactor);
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
    const { tabsInfo, activeChunkTabs, maxChunkCount } = this.state;
    const disableNext = activeChunkTabs === maxChunkCount - 1;
    const disablePrev = activeChunkTabs === 0;
    return (
      <div className={s.wrapper}>
        <ul className={s.tabs}>
          <IconButton className={s.nextTab} onClick={this.handleNextTab(-1)} disabled={disablePrev}>
            <NavigateBefore color="inherit" />
          </IconButton>
          {this.createTab(tabsInfo)}
          <IconButton className={s.nextTab} onClick={this.handleNextTab(1)} disabled={disableNext}>
            <NavigateNext color="inherit" />
          </IconButton>
        </ul>
      </div>
    );
  }
}

export default windowSize(Tabs);
