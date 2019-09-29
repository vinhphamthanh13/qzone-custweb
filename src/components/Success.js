import React from 'react';
import { bool, string, func } from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import findValueByKey from 'utils/findValueByKey';
import CustomModal from 'components/Modal/CustomModal';
import { resetModalStatus } from 'actionsReducers/common.actions';


const Success = (props) => {
  const {
    success,
    succeedMessage,
    resetModalStatus: resetModalStatusAction,
    userCallback,
  } = props;

  const callback = () => {
    resetModalStatusAction();
    userCallback();
  };

  return success ? (
    <CustomModal
      type="info"
      title="Success!"
      message={succeedMessage}
      isOpen
      cancelCallBack={callback}
      className="z-index-highest"
      isBackDropClickDisabled
    />
  ) : null;
};

Success.propTypes = {
  success: bool.isRequired,
  succeedMessage: string.isRequired,
  resetModalStatus: func.isRequired,
  userCallback: func,
};

Success.defaultProps = {
  userCallback: noop,
};

const mapStateToProps = (state) => {
  const success = [];
  const succeedMessage = [];
  findValueByKey(state, 'isSucceed', success);
  findValueByKey(state, 'succeedMessage', succeedMessage);
  return ({
    success: success.reduce((final, current) => (final || current), false),
    succeedMessage: succeedMessage.reduce((final, current) => (final || current), ''),
  });
};

export default connect(mapStateToProps, {
  resetModalStatus,
})(Success);
