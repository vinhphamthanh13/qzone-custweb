/* eslint-disable no-undef, func-names */
import React from 'react';
import { string, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Formik } from 'formik';
import { LOGIN_TYPES, FACEBOOK } from 'utils/constants';
import Error from 'components/Error';
import {
  FB_APP_ID,
  FB_API_VERSION,
  AUTH_METHOD,
} from 'config/auth';
import Form from './components/Form';
import {
  login, createGoogleScript, loginGoogle, saveUserToAws,
} from './actions/login';
import { loginSchema } from './components/schemas';

class Login extends React.Component {
  componentDidMount() {
    window.fbAsyncInit = () => {
      FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: FB_API_VERSION,
      });
      FB.AppEvents.logPageView();
    };

    (function (document, script, id) {
      const fjs = document.getElementsByTagName(script)[0];
      if (document.getElementById(id)) {
        return;
      }
      const js = document.createElement(script);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    const ga = window.gapi && window.gapi[AUTH_METHOD]
      ? window.gapi.auth2.getAuthInstance() : null;

    if (!ga) {
      createGoogleScript();
    }
  }

  handleLogin = (values, name) => {
    const {
      logInAction,
      loginGoogle: loginGoogleAction,
      isForgotPassword,
    } = this.props;

    switch (name) {
      case LOGIN_TYPES.FB:
        this.handleLoginFaceBook();
        break;
      case LOGIN_TYPES.GP:
        loginGoogleAction();
        break;
      default:
        if (!isForgotPassword) logInAction(values);
    }
    this.onClose();
  };

  onClose = () => {
    this.props.onClose();
  };

  handleLoginFaceBook = () => {
    const { saveUserToAws: saveUserToAwsAction } = this.props;
    FB.login(
      (response) => {
        const status = get(response, 'status');
        const authResponse = get(response, 'authResponse');
        if (status === FACEBOOK.STATUS.CONNECTED) {
          console.log('facebook response', response);
          saveUserToAwsAction(authResponse);
        }
      },
      { scope: 'public_profile, email' },
    );
  };


  render() {
    const { isOpen, handleAuthenticate } = this.props;
    const socialActions = {
      facebook: () => this.handleLogin('', LOGIN_TYPES.FB),
      google: () => this.handleLogin('', LOGIN_TYPES.GP),
    };
    const loginInit = {
      email: '',
      password: '',
    };

    return (
      <>
        <Error />
        {isOpen && (
          <div className="flex item-center cover-bg-black z-index-higher">
            <Formik
              initialValues={loginInit}
              validationSchema={loginSchema}
              enableReinitialize
              onSubmit={this.handleLogin}
              render={props => (
                <Form
                  {...props}
                  onClose={this.onClose}
                  socialActions={socialActions}
                  handleAuthenticate={handleAuthenticate}
                />
              )}
            />
          </div>
        )}
      </>
    );
  }
}

Login.propTypes = {
  loginGoogle: func.isRequired,
  logInAction: func.isRequired,
  saveUserToAws: func.isRequired,
  onClose: func.isRequired,
  isOpen: bool,
  errorMessage: string,
  handleAuthenticate: func.isRequired,
  isForgotPassword: bool.isRequired,
};

Login.defaultProps = {
  errorMessage: '',
  isOpen: false,
};

const mapStateToProps = state => ({
  errorMessage: state.auth.loginErrorMessage,
  isForgotPassword: state.auth.isForgotPassword,
});

export default connect(mapStateToProps, {
  loginGoogle,
  saveUserToAws,
  logInAction: login,
})(Login);
