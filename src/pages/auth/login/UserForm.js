import React from 'react';
import PropTypes from 'prop-types';
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

const UserForm = (props) => {
  const {
    classes, iconClassName, onSubmitHandler, onChange,
    isFormValid, onClose, socialActions,
  } = props;
  return (
    <form onSubmit={onSubmitHandler}>
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
          <CustomInput
            labelText="Email"
            id="email"
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
            id="registerPassword"
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
              event, 'registerPassword', 'password', 'registerConfirmPassword',
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
              disableRipple
              block
              className={classes.simpleButton}
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

UserForm.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  iconClassName: PropTypes.string.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  socialActions: PropTypes.objectOf(PropTypes.any),
};

UserForm.defaultProps = {
  socialActions: { facebook: noop, google: noop, twitter: noop },
};

export default UserForm;
