import React from 'react';
import PropTypes from 'prop-types';
import Register from './auth/RegisterModal';
import Login from './auth/LoginModal';

export default function Auth({ isRegisterOpen, isLoginOpen, closeDialog }) {
  return (
    <>
      <Register
        isOpen={isRegisterOpen}
        onClose={() => closeDialog('isRegisterOpen')}
      />
      <Login
        isOpen={isLoginOpen}
        onClose={() => closeDialog('isLoginOpen')}
      />
    </>
  );
}

Auth.propTypes = {
  isRegisterOpen: PropTypes.bool.isRequired,
  isLoginOpen: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
};
