import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { validatePassword } from 'utils/validation';
import { classesType } from 'types/global';
import { googleSignIn, facebookSignIn } from 'modules/auth.actions';
import UserForm from './forms/Login';
import registerStyles from './Auth.style';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      userName: '',
      userNameState: '',
      pwd: '',
      pwdState: '',
    };
    this.state = { ...this.defaultState };
  }

  onLoginClick = () => {
    let newState = {};

    if (!this.state.pwdState) {
      newState = { ...newState, pwdState: 'error' };
    }

    if (!this.state.userName) {
      newState = { ...newState, userNameState: 'error' };
    }

    if (Object.keys(newState).length === 0
      && this.state.pwdState === 'success'
      && this.state.userNameState === 'success') {
      this.props.loginAction(this.state);
    } else {
      this.setState(newState);
    }
  };

  change = (event, stateName, type) => {
    switch (type) {
      case 'email':
        this.setState({
          [stateName]: event.target.value,
          [`${stateName}State`]: this.verifyEmail(event.target.value) ? 'success' : 'error',
        });
        break;
      case 'password':
        this.setState({
          [stateName]: event.target.value,
          [`${stateName}State`]: validatePassword(event.target.value) ? 'success' : 'error',
        });
        break;
      default:
        break;
    }
  };

  onClose = () => {
    this.setState(this.defaultState);
    this.props.onClose();
  };

  render() {
    const {
      classes, isOpen, facebookSignInAction, googleSignInAction,
    } = this.props;
    // const {
      // userName, pwd, userNameState, pwdState,
    // } = this.state;
    const socialActions = {
      facebook: facebookSignInAction,
      google: googleSignInAction,
    };
    const adornmentClass = classes.inputAdornmentIconDefault;
    const isFormValid = true;

    return (
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} sm={6} md={4} className={classes.register}>
            <UserForm
              classes={classes}
              iconClassName={adornmentClass}
              isFormValid={isFormValid}
              onSubmitHandler={this.onLoginClick}
              onChange={this.change}
              onClose={this.onClose}
              socialActions={socialActions}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: classesType.isRequired,
  googleSignInAction: PropTypes.func.isRequired,
  loginAction: PropTypes.func.isRequired,
  facebookSignInAction: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// const mapStateToProps = state => ({
// });

export default compose(
  withStyles(registerStyles),
  connect(null, { googleSignInAction: googleSignIn, facebookSignInAction: facebookSignIn }),
)(LoginPage);
