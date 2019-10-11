import React from 'react';
import {
  bool,
  string,
  func,
} from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import findValueByKey from 'utils/findValueByKey';
import CustomModal from 'components/Modal/CustomModal';
import { resetModalStatus } from 'actionsReducers/common.actions';

const Error = (props) => {
  const {
    error,
    errorMessage,
    resetModalStatus: resetModalStatusAction,
    resetOtherStatus,
  } = props;

  const resetStatus = () => {
    console.log('execute other now!!!!!!!');
    resetOtherStatus();
    resetModalStatusAction();
  };

  console.log('in error', resetModalStatusAction);
  return error ? (
    <CustomModal
      type="error"
      title="Error occurs!"
      message={errorMessage}
      isOpen
      className="z-index-highest"
      isBackDropClickDisabled
      cancelCallBack={resetStatus}
    />
  ) : null;
};

Error.propTypes = {
  error: bool.isRequired,
  errorMessage: string.isRequired,
  resetModalStatus: func.isRequired,
  resetOtherStatus: func,
};

Error.defaultProps = {
  resetOtherStatus: noop,
};

const mapStateToProps = (state) => {
  const error = [];
  const errorMessage = [];
  findValueByKey(state, 'isError', error);
  findValueByKey(state, 'errorMessage', errorMessage);
  return ({
    error: error.reduce((final, current) => (final || current), false),
    errorMessage: errorMessage.reduce((final, current) => (final || current), ''),
  });
};

export default connect(mapStateToProps, {
  resetModalStatus,
})(Error);
