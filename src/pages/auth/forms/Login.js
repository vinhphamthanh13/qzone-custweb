import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'utils/constants';
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
import CustomInput from 'components/CustomInput';
import CustomButton from 'components/CustomButton';
import { login } from 'modules/auth.actions';

const Login = (props) => {
  const {
    classes, iconClassName, onSubmitHandler, onChange,
    isFormValid, onClose, socialActions,
  } = props;
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
        <form onSubmit={onSubmitHandler}>
          <CustomInput
            labelText="Email"
            id="loginemail"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'text',
              endAdornment: (
                <InputAdornment position="end">
                  <Email className={iconClassName} />
                </InputAdornment>
              ),
            }}
            onChange={event => onChange(event, 'giveName', 'name')}
          />
          <CustomInput
            labelText="Password"
            id="loginPassword"
            formControlProps={{
              fullWidth: true,
              className: classes.marginDense,
            }}
            inputProps={{
              type: 'password',
              endAdornment: (
                <InputAdornment position="end">
                  <LockOutline
                    className={iconClassName}
                  />
                </InputAdornment>
              ),
            }}
            onChange={event => onChange(
              event, 'loginPassword', 'password',
            )}
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
              disabled={!isFormValid}
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
};

Login.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  iconClassName: PropTypes.string.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  socialActions: PropTypes.objectOf(PropTypes.any),
};

Login.defaultProps = {
  socialActions: { facebook: noop, google: noop, twitter: noop },
};

const mapDispatchToProps = dispatch => ({
  loginAction: () => dispatch(login),
});

export default connect(null, mapDispatchToProps)(Login);
