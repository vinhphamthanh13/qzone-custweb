import React, { Component } from 'react';
import {
  func,
} from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import uuidv1 from 'uuid/v1';
import { withFormik } from 'formik';
import {
  Typography,
} from '@material-ui/core';
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
        {waitLists && waitLists.map(item => (
          <div key={uuidv1()} className={s.waitSlot}>
            <Typography variant="title" color="inherit">
              {item.slot.sstartSec}
            </Typography>
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

export default compose(
  withFormik({
    enableReinitialize: true,
  }),
  connect(mapStateToProps, {
    setWaitListsAction,
  }),
)(WaitList);
