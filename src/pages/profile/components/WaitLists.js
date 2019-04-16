import React from 'react';
import { arrayOf, any } from 'prop-types';
import { connect } from 'react-redux';
import s from './WaitList.module.scss';

const WaitList = (props) => {
  const { waitList } = props;
  return (
    <div className={s.waitList}>
      {waitList.map(slot => (
        <div className={s.waitSlot}>
          {slot.name}
        </div>
      ))}
    </div>
  );
};

WaitList.propTypes = {
  waitList: arrayOf(any).isRequired,
};

const mapStateToProps = state => ({
  waitList: state.waitList.waitList,
});

export default connect(mapStateToProps)(WaitList);
