import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import {
  Call, Check, Email, InsertEmoticon, Lock as LockOutline,
} from '@material-ui/icons';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import TextField from '@material-ui/core/TextField';

class Register extends React.Component {
  onChange = (event) => {
    event.persist();
    const { handleChange } = this.props;
    handleChange(event);
  };

  render() {
    const {
      classes, iconClassName, onSubmitHandler,
      policyAgreement, onClose,
      values: {
        givenName,
        phoneNumber,
        email,
        password,
        confirmPassword,
      },
      errors,
      touched,
      // handleSubmit,
      // handleChange,
      isValid,
      // setFieldTouched
    } = this.props;
    return (
      <form onSubmit={onSubmitHandler}>
        <Card className={classes.registerCard}>
          <CardHeader
            className={`${classes.cardHeader} ${classes.textCenter}`}
            color="main"
          >
            <Typography variant="h5" color="inherit">Register</Typography>
          </CardHeader>
          <CardBody>
            <TextField
              id="given-name"
              name="givenName"
              type="text"
              autoFocus
              fullWidth
              helperText={touched.givenName ? errors.givenName : ''}
              label="Given name"
              value={givenName}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <InsertEmoticon className={iconClassName} />
                  </InputAdornment>
                ),
              }}
              onChange={this.onChange}
            />
            <TextField
              id="phone-number"
              name="phoneNumber"
              type="tel"
              fullWidth
              label="Phone number"
              value={phoneNumber}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <Call className={iconClassName} />
                  </InputAdornment>
                ),
              }}
              onChange={this.onChange}
            />
            <TextField
              id="email"
              name="email"
              type="email"
              fullWidth
              label="Email"
              value={email}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <Email className={iconClassName} />
                  </InputAdornment>
                ),
              }}
              onChange={this.onChange}
            />
            <TextField
              id="password"
              name="password"
              type="password"
              fullWidth
              label="Password"
              value={password}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutline className={iconClassName} />
                  </InputAdornment>
                ),
              }}
              onChange={this.onChange}
            />
            <TextField
              id="confirm-password"
              name="confirmPassword"
              type="password"
              fullWidth
              label="Confirm password"
              value={confirmPassword}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutline className={iconClassName} />
                  </InputAdornment>
                ),
              }}
              onChange={this.onChange}
            />
            <FormControlLabel
              control={(
                <Checkbox
                  tabIndex={-1}
                  onClick={this.onChange}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.agreement,
                  }}
                />
              )}
              classes={{
                label:
                  classes.label
                  + (policyAgreement === 'error'
                    ? ` ${classes.labelError}`
                    : ''),
              }}
              label={(
                <span>
                  I agree to the terms and conditions
                </span>
              )}
            />
            <div className={classes.center}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                disabled={!isValid}
              >
                Submit
              </Button>
              <Button
                color="primary"
                variant="text"
                disableRipple
                className={classes.simpleButton}
                onClick={onClose}
              >
                Discard
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  iconClassName: PropTypes.string.isRequired,
  policyAgreement: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  touched: PropTypes.objectOf(PropTypes.any).isRequired,
  values: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Register;
