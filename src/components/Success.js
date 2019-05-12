import React from 'react';
import {
  bool,
  string,
  func,
} from 'prop-types';
import { connect } from 'react-redux';
import findValueByKey from 'utils/findValueByKey';
import CustomModal from 'components/Modal/CustomModal';
// import { resetSuccessMessage } from 'actionsReducers/common.actions';


const Success = (props) => {
  const {
    success,
    successMessage,
    resetSuccessMessage: resetSuccessMessageAction,
  } = props;

  console.log('in the success modal', props);
  return success ? (
    <CustomModal
      type="success"
      title="Success occurs!"
      message={successMessage}
      isOpen
      onClose={resetSuccessMessageAction}
      className="z-index-highest"
    />
  ) : null;
};

Success.propTypes = {
  success: bool.isRequired,
  successMessage: string.isRequired,
  resetSuccessMessage: func.isRequired,
};

const mapStateToProps = (state) => {
  const success = [];
  const successMessage = [];
  findValueByKey(state, 'isSuccess', success);
  findValueByKey(state, 'successMessage', successMessage);
  return ({
    success: success.reduce((final, current) => (final || current), false),
    successMessage: successMessage.reduce((final, current) => (final || current), ''),
  });
};

export default connect(mapStateToProps, {
  // resetSuccessMessage,
})(Success);
