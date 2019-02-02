import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { register } from 'modules/auth.actions';

class Register extends React.Component {
  state = {
    // nameState: '',
    // phoneState: '',
    // emailState: '',
    // passwordState: '',
    // confirmState: '',
  };

  onChange = (name, event) => {
    event.persist();
    const { handleChange, setFieldTouched } = this.props;
    handleChange(event);
    setFieldTouched(name, true, false);
  };

  submitHandler = (event) => {
    const {
      // handleSubmit,
      values,
    } = this.props;
    event.preventDefault();
    alert('You are register a new account. It coming soon');
    console.log('your form data', values);
    // handleSubmit(values);
  };

  render() {
    const {
      classes,
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
      isValid,
    } = this.props;
    const iconClassName = classes.inputAdornmentIconDefault;
    return (
      <form onSubmit={this.submitHandler}>
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
              autoFocus
              classes={{ root: classes.marginLoose }}
              fullWidth
              error={touched.givenName ? errors.givenName : ''}
              label="Given name"
              value={givenName}
              formControlProps={{
                className: classes.marginDense,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <InsertEmoticon className={iconClassName} />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('givenName', event)}
            />
            <TextField
              id="phone-number"
              name="phoneNumber"
              type="tel"
              error={touched.phoneNumber ? errors.phoneNumber : ''}
              classes={{ root: classes.marginLoose }}
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
              onChange={event => this.onChange('phoneNumber', event)}
            />
            <TextField
              id="email"
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
                    <Email className={iconClassName} />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('email', event)}
            />
            <TextField
              id="password"
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
                    <LockOutline className={iconClassName} />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('password', event)}
            />
            <TextField
              id="confirm-password"
              name="confirmPassword"
              type="password"
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              classes={{ root: classes.marginLoose }}
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
              onChange={event => this.onChange('confirmPassword', event)}
            />
            <FormControlLabel
              control={(
                <Checkbox
                  tabIndex={-1}
                  name="policy"
                  onClick={event => this.onChange('policy', event)}
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
                type="submit"
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
  policyAgreement: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  touched: PropTypes.objectOf(PropTypes.any).isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(null, {
  registerAction: register,
})(Register);
