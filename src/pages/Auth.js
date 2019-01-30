import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'utils/constants';
import Register from './auth/RegisterModal';
import Login from './auth/LoginModal';

export default function Auth({ isLoginOpen, closeDialog, isRegisterOpen }) {
  return (
    <>
      <Register
        isOpen={isRegisterOpen}
        onClose={() => closeDialog('isRegisterOpen')}
      />
      <Login
        isOpen={isLoginOpen}
        onClose={() => closeDialog('isLoginOpen')}
        loginAction={noop}
      />
    </>
  );
}

Auth.propTypes = {
  isRegisterOpen: PropTypes.bool.isRequired,
  isLoginOpen: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
};
