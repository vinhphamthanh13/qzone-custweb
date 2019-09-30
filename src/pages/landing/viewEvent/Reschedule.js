import React, { Component } from 'react';
// import { func, string } from 'prop-types';
import s from './Reschedule.module.scss';

class Reschedule extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  state = {};
  //
  // static getDerivedStateFromProps(props, state) {
  //   const {} = props;
  //   const {} = state;
  //   const updatedState = {};
  //   if () {
  //   }
  //
  //   return Object.keys(updatedState) ? updatedState : null;
  // }

  render() {
    return (
      <div className={s.container}>
        rescheduled
      </div>
    );
  }
}

export default Reschedule;
