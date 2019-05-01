import React, { Component } from 'react';
import {
  func,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  setWaitListsAction,
} from 'actionsReducers/waitlist.actions';
import s from './WaitList.module.scss';

class WaitList extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      waitLists,
    } = props;
    const {
      waitLists: cachedWaitLists,
    } = state;
    if (
      waitLists !== cachedWaitLists
    ) {
      return {
        waitLists,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      waitLists: null,
    };
  }

  componentDidMount() {
    const { setWaitListsAction: setWaitLists } = this.props;
    setWaitLists();
  }


  render() {
    const { waitLists } = this.state;
    return (
      <div className={s.waitList}>
        {waitLists && waitLists.map(slot => (
          <div className={s.waitSlot}>
            {slot.name}
          </div>
        ))}
      </div>
    );
  }
}

WaitList.propTypes = {
  setWaitListsAction: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.waitLists,
});

export default connect(mapStateToProps, {
  setWaitListsAction,
})(WaitList);
