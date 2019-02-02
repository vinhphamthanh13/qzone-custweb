import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import {
  Call,
  Check, Email, InsertEmoticon, Lock as LockOutline,
} from '@material-ui/icons';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import TextField from '@material-ui/core/TextField';
import { register } from 'modules/auth.actions';

export const resolveIconClassName = (name, value, errors, touched, classes) => {
  switch (value) {
    case '':
      return touched[name] ? classes.inputAdornmentIconError : classes.inputAdornmentIconDefault;
    default:
      return errors[name] ? classes.inputAdornmentIconError : classes.inputAdornmentIconSuccess;
  }
};

class Register extends React.Component {
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
      classes, onClose, values: {
        givenName,
        cellPhone,
        email,
        password,
        confirmPassword,
      },
      errors, touched, isValid,
    } = this.props;
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
                    <InsertEmoticon
                      className={resolveIconClassName('givenName', givenName, errors, touched, classes)}
                    />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('givenName', event)}
            />
            <TextField
              id="phone-number"
              name="cellPhone"
              error={touched.cellPhone ? errors.cellPhone : ''}
              classes={{ root: classes.marginLoose }}
              fullWidth
              label="Phone number"
              value={cellPhone}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <Call className={resolveIconClassName('cellPhone', cellPhone, errors, touched, classes)} />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('cellPhone', event)}
            />
            <TextField
              id="registeremail"
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
              id="registerpassword"
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
                    <LockOutline
                      className={resolveIconClassName('confirmPassword', confirmPassword, errors, touched, classes)}
                    />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('confirmPassword', event)}
            />
            <FormControlLabel
              control={(
                <Checkbox
                  tabIndex={-1}
                  name="policyAgreement"
                  onClick={event => this.onChange('policyAgreement', event)}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  color="primary"
                  classes={{
                    root: classes.policyAgreement,
                  }}
                />
              )}
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
