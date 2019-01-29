import React from 'react';
import PropTypes from 'prop-types';
import Register from './auth/Register';
import Login from './auth/Login';

export default function Auth({ isLoginOpen, closeDialog, isRegisterOpen }) {
  return (
    <>
      <Register isOpen={isRegisterOpen} onClose={() => closeDialog('isRegisterOpen')} />
      <Login isOpen={isLoginOpen} onClose={() => closeDialog('isLoginOpen')} />
    </>
  );
}

Auth.propTypes = {
  isRegisterOpen: PropTypes.bool.isRequired,
  isLoginOpen: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
};
