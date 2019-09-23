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
    setTabOrder: func.isRequired,
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
    tabOrder: { 0: 0 },
  };

  static getDerivedStateFromProps(props, state) {
    const { tabsInfo, windowWidth, tabOrder } = props;
    const {
      tabsInfo: cachedTabsInfo,
      windowWidth: cachedWindowWidth,
      tabOrder: cachedTabOrder,
    } = state;
    const updatedState = {};
    if (JSON.stringify(tabsInfo) !== JSON.stringify(cachedTabsInfo)) {
      updatedState.tabsInfo = tabsInfo;
    }
    if (windowWidth !== cachedWindowWidth) {
      updatedState.windowWidth = windowWidth;
    }
    if (JSON.stringify(tabOrder) !== JSON.stringify(cachedTabOrder)) {
      updatedState.chunkHistory = tabOrder;
    }

    return Object.keys(updatedState).length ? updatedState : null;
  }

  componentDidMount() {
    const { onSelectTab } = this.props;
    const { tabsInfo, activeTab, windowWidth, tabOrder } = this.state;
    const initCatName = Object.keys(tabsInfo)[0];
    const initChunkTab = Number(Object.keys(tabOrder)[0]);
    const initTabInfo = tabsInfo[initCatName];
    onSelectTab(activeTab, initTabInfo, initCatName)();
    const chunkFactor = Math.abs(windowWidth / (MAX_TAB_WIDTH + 96));
    this.setState({
      maxChunkCount: chunk(Object.keys(tabsInfo), chunkFactor).length,
      activeChunkTabs: initChunkTab,
      chunkFactor,
      chunkHistory: tabOrder,
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
    const { onSelectTab, setTabOrder } = this.props;
    const { activeChunkTabs, chunkHistory } = this.state;
    this.setState({
      activeTab: index,
      chunkHistory: {
        [activeChunkTabs]: index,
      },
    });
    const oldChunk = Object.keys(chunkHistory)[0];
    const oldTab = chunkHistory[oldChunk];
    setTabOrder({ [activeChunkTabs]: index });
    if (Number(oldChunk) !== activeChunkTabs || oldTab !== index) {
      onSelectTab(index, tabInfo, catName)();
    }
  };

  createTab = tabsInfo => {
    const { chunkFactor } = this.state;
    const { activeChunkTabs, chunkHistory } = this.state;
    console.log('active chunk tab create tab', activeChunkTabs);
    const tabChunkCount = chunk(Object.keys(tabsInfo), chunkFactor);
    const lazyTabs = tabChunkCount[activeChunkTabs] || [];
    return lazyTabs.length > 0 && lazyTabs.map((tab, index) => {
      const tabStyle = chunkHistory[activeChunkTabs] === index ? `${s.tab} ${s.tabActive}` : s.tab;
      return (
        // eslint-disable-next-line
        <div
          key={tab}
          className={`${tabStyle}`}
          onClick={this.handleSelectTab(index, tabsInfo[tab], tab)}>
            {tab}
        </div>
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
