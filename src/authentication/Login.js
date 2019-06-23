/* eslint-disable no-undef, func-names */
import React from 'react';
import { string, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import CustomModal from 'components/Modal/CustomModal';
import { Formik } from 'formik';
import { resetModalStatus } from 'actionsReducers/common.actions';
import { loginType, FACEBOOK } from 'utils/constants';
import {
  FB_APP_ID,
  FB_API_VERSION,
} from 'config/auth';
import Form from './components/Form';
import {
  login, createGoogleScript, googleLogIn, facebookLogIn,
} from './actions/login';
import { loginSchema } from './components/schemas';

class Login extends React.Component {
  state = {
    error: { open: false, errorMessage: '' },
  };

  componentDidMount() {
    const ga = window.gapi && window.gapi.auth2
      ? window.gapi.auth2.getAuthInstance() : null;

    if (!ga) {
      createGoogleScript();
    }

    window.fbAsyncInit = () => {
      FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: FB_API_VERSION,
      });

      FB.AppEvents.logPageView();
      FB.getLoginStatus((response) => {
        const status = get(response, 'status');
        const authResponse = get(response, 'authResponse');
        console.log('facebook', authResponse);
        if (status === FACEBOOK.STATUS.CONNECTED) {
          // this.redirectToDashboard();
          // this.handleFacebookUserData(authResponse);
        }
      });
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
  }

  componentWillReceiveProps(nextProps) {
    const { errorMessage } = nextProps;
    let error = {};
    if (errorMessage) {
      error = { open: true, errorMessage };
    } else {
      error = { open: false, errorMessage };
    }
    this.setState({ error });
  }

  onLogin = (values, name) => {
    const {
      logInAction,
      facebookLogIn: facebookLogInAction,
      googleLogIn: googleLogInAction,
      isForgotPassword,
    } = this.props;

    switch (name) {
      case loginType.FB:
        facebookLogInAction();
        break;
      case loginType.GP:
        googleLogInAction();
        break;
      default:
        if (!isForgotPassword) logInAction(values);
    }
    this.onClose();
  };

  onClose = () => {
    this.props.onClose();
  };

  closeCustomModal = () => {
    const { resetModalStatusAction } = this.props;
    resetModalStatusAction();
  };

  render() {
    const { isOpen, handleAuthenticate } = this.props;
    const socialActions = {
      facebook: () => this.onLogin('', loginType.FB),
      google: () => this.onLogin('', loginType.GP),
    };
    const loginInit = {
      email: '',
      password: '',
    };
    const { error: { open, errorMessage } } = this.state;
    const errorModal = open
      ? (
        <CustomModal
          type="error"
          title="Login failed!"
          message={errorMessage}
          isOpen={!!errorMessage}
          onClose={this.closeCustomModal}
        />) : null;

    return (
      <>
        {errorModal}
        {isOpen && (
          <div className="flex item-center cover-bg-black z-index-higher">
            <Formik
              initialValues={loginInit}
              validationSchema={loginSchema}
              enableReinitialize
              onSubmit={this.onLogin}
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
  googleLogIn: func.isRequired,
  logInAction: func.isRequired,
  facebookLogIn: func.isRequired,
  onClose: func.isRequired,
  isOpen: bool,
  resetModalStatusAction: func.isRequired,
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
  googleLogIn,
  facebookLogIn,
  logInAction: login,
  resetModalStatusAction: resetModalStatus,
})(Login);
