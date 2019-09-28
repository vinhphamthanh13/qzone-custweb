import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import windowSize from 'react-window-size';
import { IconButton } from '@material-ui/core';
import { NavigateNext, NavigateBefore } from '@material-ui/icons';
import { chunk } from 'lodash';
import { MAX_TAB_WIDTH } from 'utils/constants';
import { setChunkFactorAction } from 'actionsReducers/common.actions';
import s from './Tabs.module.scss';

class Tabs extends Component {
  static propTypes = {
    onSelectTab: func.isRequired,
    setTabOrder: func.isRequired,
    dispatchChunkFactor: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    tabsInfo: [],
    activeTab: 0,
    activeChunkTabs: 0,
    chunkHistory: {},
    windowWidth: 0,
    tabOrder: { 0: 0 },
    responsiveLayout: {
      chunkFactor: 1,
      maxChunkCount: 0,
    },
  };

  static getDerivedStateFromProps(props, state) {
    const { tabsInfo, windowWidth, tabOrder, responsiveLayout } = props;
    const {
      tabsInfo: cachedTabsInfo,
      windowWidth: cachedWindowWidth,
      tabOrder: cachedTabOrder,
      responsiveLayout: cachedResponsiveLayout,
    } = state;
    const updatedState = {};
    if (
      tabsInfo !== null &&
      JSON.stringify(tabsInfo) !== JSON.stringify(cachedTabsInfo)
    ) {
      updatedState.tabsInfo = tabsInfo;
    }
    if (windowWidth !== cachedWindowWidth) {
      updatedState.windowWidth = windowWidth;
    }
    if (
      tabOrder !== null &&
      JSON.stringify(tabOrder) !== JSON.stringify(cachedTabOrder)
    ) {
      updatedState.chunkHistory = tabOrder;
    }
    if (
      responsiveLayout !== null &&
      JSON.stringify(responsiveLayout) !== JSON.stringify(cachedResponsiveLayout)
    ) {
      updatedState.responsiveLayout = responsiveLayout;
    }

    return Object.keys(updatedState).length ? updatedState : null;
  }

  componentDidMount() {
    const { onSelectTab, dispatchChunkFactor } = this.props;
    const { tabsInfo, activeTab, windowWidth, tabOrder } = this.state;
    const initCatName = Object.keys(tabsInfo)[0];
    const initChunkTab = Number(Object.keys(tabOrder)[0]);
    const initTabInfo = tabsInfo[initCatName];
    onSelectTab(activeTab, initTabInfo, initCatName)();
    const chunkFactor = Math.abs(windowWidth / (MAX_TAB_WIDTH + 96));
    const maxChunkCount = chunk(Object.keys(tabsInfo), chunkFactor).length;
    dispatchChunkFactor({ chunkFactor, maxChunkCount });
    this.setState({
      activeChunkTabs: initChunkTab,
      chunkHistory: tabOrder,
    });
  }

  componentDidUpdate(prevProps) {
    const { windowWidth, dispatchChunkFactor } = prevProps;
    const { windowWidth: cachedWindowWidth, tabsInfo } = this.state;
    if (windowWidth !== cachedWindowWidth) {
      const chunkFactor = Math.abs(windowWidth / (MAX_TAB_WIDTH + 96));
      const maxChunkCount = chunk(Object.keys(tabsInfo), chunkFactor).length;
      dispatchChunkFactor({ chunkFactor, maxChunkCount });
    }
  }

  handleNextTab = value => () => {
    const { activeChunkTabs, responsiveLayout: { maxChunkCount } } = this.state;
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
    const { responsiveLayout: { chunkFactor } } = this.state;
    const { activeChunkTabs, chunkHistory } = this.state;
    const tabChunkCount = chunk(Object.keys(tabsInfo), chunkFactor);
    const lazyTabs = tabChunkCount[activeChunkTabs] || tabChunkCount[0] || [];
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
    const { tabsInfo, activeChunkTabs, responsiveLayout: { maxChunkCount } } = this.state;
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

export default connect(
  ({ common }) => ({
    responsiveLayout: common.responsiveLayout,
  }),
  dispatch => ({
    dispatchChunkFactor: width => dispatch(setChunkFactorAction(width)),
}))(windowSize(Tabs));
