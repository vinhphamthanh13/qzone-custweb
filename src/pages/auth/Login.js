import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography } from '@material-ui/core';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GridContainer from 'components/Grid/GridContainer';
import CustomButton from 'components/CustomButton';
import CustomInput from 'components/CustomInput';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { validatePassword } from 'utils/validation';
import { classesType } from 'types/global';
import { googleSignIn, facebookSignIn } from 'modules/auth.actions';
import loginStyle from './Login.style';

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
  }

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
  }

  onClose = () => {
    this.setState(this.defaultState);
    this.props.onClose();
  }

  render() {
    const {
      classes, isOpen, facebookSignInAction, googleSignInAction,
    } = this.props;
    const {
      userName, pwd, userNameState, pwdState,
    } = this.state;
    return (
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <form>
                <Card>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                  >
                    <Typography variant="h5" color="inherit">Login</Typography>
                    <div className={classes.socialLine}>
                      <CustomButton
                        justIcon
                        href="https://www.twitter.com"
                        target="_blank"
                        color="transparent"
                      >
                        <i className="fab fa-twitter" />
                      </CustomButton>
                      <CustomButton
                        justIcon
                        onClick={facebookSignInAction}
                        target="_blank"
                        color="transparent"
                      >
                        <i className="fab fa-facebook" />
                      </CustomButton>
                      <CustomButton
                        justIcon
                        onClick={googleSignInAction}
                        target="_blank"
                        color="transparent"
                      >
                        <i className="fab fa-google-plus-g" />
                      </CustomButton>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="User name"
                      success={userNameState === 'success'}
                      error={userNameState === 'error'}
                      id="login-userName"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        onChange: event => this.change(event, 'userName'),
                        value: userName,
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      success={pwdState === 'success'}
                      error={pwdState === 'error'}
                      id="login-pwd"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        onChange: event => this.change(
                          event, 'pwd', 'password',
                        ),
                        type: 'password',
                        value: pwd,
                      }}
                    />
                    <div className={classes.center}>
                      <CustomButton
                        color="rose"
                        onClick={this.onLoginClick}
                      >
                        Login
                      </CustomButton>
                      <CustomButton
                        color="transparent"
                        onClick={this.onClose}
                      >
                        Close
                      </CustomButton>
                    </div>
                  </CardBody>
                </Card>
              </form>
            </GridItem>
          </GridContainer>
        </div>
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
  withStyles(loginStyle),
  connect(null, { googleSignInAction: googleSignIn, facebookSignInAction: facebookSignIn }),
)(LoginPage);
