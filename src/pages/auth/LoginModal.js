import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { classesType } from 'types/global';
import { googleSignIn, facebookSignIn, login } from 'modules/auth.actions';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { regExPattern, noop } from 'utils/constants';
import UserForm from './forms/Login';
import authStyles from './Auth.style';

const loginSchema = Yup.object().shape({
  email: Yup
    .string()
    .email('Email is not valid')
    .matches(regExPattern.email, 'Email format is not correct')
    .required('Email is required'),
  password: Yup
    .string()
    .matches(regExPattern.password, 'Password format is not correct')
    .min(8, 'Password must contain at least 8 characters')
    .required('Password is required'),
});

class LoginModal extends React.Component {
  onLoginClick = (e) => {
    e.preventDefault();
    const { normalLogin } = this.props;
    normalLogin(this.state);
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    const {
      classes, isOpen, facebookSignInAction, googleSignInAction,
    } = this.props;
    const socialActions = {
      facebook: facebookSignInAction,
      google: googleSignInAction,
    };
    const loginInit = {
      email: '',
      password: '',
    };

    return (
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} sm={6} md={4} className={classes.register}>
            <Formik
              initialValues={loginInit}
              validationSchema={loginSchema}
              onSubmit={noop}
              render={props => (
                <UserForm
                  {...props}
                  classes={classes}
                  onClose={this.onClose}
                  socialActions={socialActions}
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginModal.propTypes = {
  classes: classesType.isRequired,
  googleSignInAction: PropTypes.func.isRequired,
  normalLogin: PropTypes.func.isRequired,
  facebookSignInAction: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// const mapStateToProps = state => ({
// });

export default compose(
  withStyles(authStyles),
  connect(null, {
    googleSignInAction: googleSignIn,
    facebookSignInAction: facebookSignIn,
    normalLogin: login,
  }),
)(LoginModal);
