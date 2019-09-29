import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import windowSize from 'react-window-size';
import { IconButton } from '@material-ui/core';
import { NavigateNext, NavigateBefore } from '@material-ui/icons';
import { chunk, get } from 'lodash';
import { MAX_TAB_WIDTH, CATEGORY_NAV_WIDTH } from 'utils/constants';
import { tabProps } from '../../commonProps';
import s from './Tabs.module.scss';

class Tabs extends Component {
  static propTypes = {
    onSelectTab: func.isRequired,
    dispatchChunkFactor: func.isRequired,
  };

  state = {
    activeChunkTabs: 0,
    windowWidth: 0,
    tabOrder: { 0: 0 },
    responsiveLayout: {
      chunkFactor: 1,
      maxChunkCount: 0,
    },
    landingPageFactors: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { windowWidth, tabOrder, responsiveLayout, landingPageFactors } = props;
    const {
      windowWidth: cachedWindowWidth,
      tabOrder: cachedTabOrder,
      responsiveLayout: cachedResponsiveLayout,
      landingPageFactors: cachedLandingPageFactors,
    } = state;
    const updatedState = {};
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
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
    const { windowWidth, tabOrder, landingPageFactors } = this.state;
    const initChunkTab = Number(Object.keys(tabOrder)[0]);
    const catName = get(landingPageFactors, 'catName');
    const tabsInfo = get(landingPageFactors, 'tabsInfo');
    const tabInfo = get(landingPageFactors, `tabsInfo.${catName}`);
    if (tabInfo) onSelectTab(tabInfo, catName)();
    const chunkFactor = Math.abs(windowWidth / (MAX_TAB_WIDTH + CATEGORY_NAV_WIDTH));
    const maxChunkCount = chunk(Object.keys(tabsInfo), chunkFactor).length;
    dispatchChunkFactor({ chunkFactor, maxChunkCount });
    this.setState({
      activeChunkTabs: initChunkTab,
    });
  }

  componentDidUpdate(prevProps) {
    const { windowWidth, dispatchChunkFactor } = prevProps;
    const { windowWidth: cachedWindowWidth, landingPageFactors } = this.state;
    if (windowWidth !== cachedWindowWidth) {
      const chunkFactor = Math.abs(windowWidth / (MAX_TAB_WIDTH + CATEGORY_NAV_WIDTH));
      const tabsInfo = get(landingPageFactors, 'tabsInfo');
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

  handleSelectTab = (tabInfo, catName) => () => {
    const { onSelectTab } = this.props;
    onSelectTab(tabInfo, catName)();
  };

  createTab = tabsInfo => {
    const {  activeChunkTabs, responsiveLayout: { chunkFactor }, landingPageFactors } = this.state;
    const catName = get(landingPageFactors, 'catName');
    const tabChunkCount = chunk(Object.keys(tabsInfo), chunkFactor);
    const lazyTabs = tabChunkCount[activeChunkTabs] || tabChunkCount[0] || [];
    return lazyTabs.length > 0 && lazyTabs.map((tab) => {
      const tabStyle = catName === tab ? `${s.tab} ${s.tabActive}` : s.tab;
      return (
        // eslint-disable-next-line
        <div key={tab} className={`${tabStyle}`} onClick={this.handleSelectTab(tabsInfo[tab], tab)}>{tab}</div>
      )
    });
  };

  render() {
    const { activeChunkTabs, responsiveLayout: { maxChunkCount }, landingPageFactors } = this.state;
    const tabsInfo = get(landingPageFactors, 'tabsInfo');
    const disableNext = activeChunkTabs === maxChunkCount - 1;
    const disablePrev = activeChunkTabs === 0;
    return (
      <div className={s.wrapper}>
        <ul className={s.tabs}>
          <IconButton className={s.nextTab} onClick={this.handleNextTab(-1)} disabled={disablePrev}>
            <NavigateBefore className="icon-big" color="inherit" />
          </IconButton>
          {!!tabsInfo && Object.keys(tabsInfo) && this.createTab(tabsInfo)}
          <IconButton className={s.nextTab} onClick={this.handleNextTab(1)} disabled={disableNext}>
            <NavigateNext className="icon-big" color="inherit" />
          </IconButton>
        </ul>
      </div>
    );
  }
}

export default connect(
  tabProps.mapStateToProps,
  tabProps.mapDispatchToProps,
)(windowSize(Tabs));
