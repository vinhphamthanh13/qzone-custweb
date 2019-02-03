import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import {
  Email, Lock as LockOutline,
} from '@material-ui/icons';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import TextField from '@material-ui/core/TextField';
import CustomButton from 'components/CustomButton';
import { noop } from 'utils/constants';
import { resolveIconClassName } from './Register';

class Login extends React.Component {
  onChange = (name, event) => {
    event.persist();
    const { handleChange, setFieldTouched } = this.props;
    const { target: { value } } = event;
    if (!/^\S+$/.test(value) && value.length) return;
    handleChange(event);
    setFieldTouched(name, true, false);
  };

  render() {
    const {
      classes, onClose, socialActions,
      values: { email, password },
      touched, errors, handleSubmit, isValid,
    } = this.props;
    return (
      <Card className={classes.registerCard}>
        <CardHeader
          className={`${classes.cardHeader} ${classes.textCenter} ${classes.loginPanel}`}
          color="main"
        >
          <Typography variant="h5" color="inherit">Login</Typography>
          <div className={classes.socialButtons}>
            <CustomButton
              justIcon
              onClick={socialActions.twitter}
              target="_blank"
              className={classes.socialButton}
              color="transparent"
            >
              <i className={`fab fa-twitter ${classes.socialIcon}`} />
            </CustomButton>
            <CustomButton
              justIcon
              onClick={socialActions.facebook}
              target="_blank"
              className={classes.socialButton}
              color="transparent"
            >
              <i className={`fab fa-facebook ${classes.socialIcon}`} />
            </CustomButton>
            <CustomButton
              justIcon
              onClick={socialActions.google}
              target="_blank"
              className={classes.socialButton}
              color="transparent"
            >
              <i className={`fab fa-google-plus-g ${classes.socialIcon}`} />
            </CustomButton>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <TextField
              id="login-email"
              name="email"
              type="email"
              error={touched.email ? errors.email : ''}
              classes={{ root: classes.marginLoose }}
              fullWidth
              label="Email"
              value={email}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <Email className={resolveIconClassName('email', email, errors, touched, classes)} />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('email', event)}
            />
            <TextField
              id="loginpassword"
              name="password"
              type="password"
              error={touched.password ? errors.password : ''}
              classes={{ root: classes.marginLoose }}
              fullWidth
              label="Password"
              value={password}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutline className={resolveIconClassName('password', password, errors, touched, classes)} />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('password', event)}
            />
            <div className={classes.resetPassword}>
              { /* eslint-disable-next-line */ }
              <Link
                component="button"
                variant="body1"
                rel="noopener"
                onClick={noop}
              >
                Reset password?
              </Link>
            </div>
            <div className={classes.center}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isValid}
                type="submit"
              >
                Submit
              </Button>
              <Button
                variant="text"
                color="primary"
                disableRipple
                className={classes.simpleButton}
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  touched: PropTypes.objectOf(PropTypes.any).isRequired,
  onClose: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  socialActions: PropTypes.objectOf(PropTypes.any),
};

Login.defaultProps = {
  socialActions: { facebook: noop, google: noop, twitter: noop },
};

export default Login;
