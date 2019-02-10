import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, InputAdornment, Button, Checkbox, FormControlLabel, TextField, Popover,
} from '@material-ui/core';
import {
  Call, Check, Email, InsertEmoticon, Lock as LockOutline, ContactSupportRounded,
} from '@material-ui/icons';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
// import { registerPopoverPosition } from 'utils/constants';

export const resolveIconClassName = (name, value, errors, touched, classes) => {
  switch (value) {
    case '':
      return touched[name] ? classes.inputAdornmentIconError : classes.inputAdornmentIconDefault;
    default:
      return errors[name] ? classes.inputAdornmentIconError : classes.inputAdornmentIconSuccess;
  }
};

class Register extends React.Component {
  state = {
    anchorEl: null,
  };

  handlePopoverOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

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
        telephone,
        email,
        password,
        confirmPassword,
      },
      handleSubmit,
      errors, touched, isValid,
    } = this.props;
    const { anchorEl } = this.state;
    const openPopover = !!anchorEl;

    return (
      <form onSubmit={handleSubmit}>
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
              error={touched.givenName ? !!errors.givenName : false}
              label="Given name"
              value={givenName}
              InputProps={{
                className: classes.marginDense,
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
              name="telephone"
              error={touched.telephone ? !!errors.telephone : false}
              classes={{ root: classes.marginLoose }}
              fullWidth
              label="Phone number"
              value={telephone}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    <Call className={resolveIconClassName('telephone', telephone, errors, touched, classes)} />
                  </InputAdornment>
                ),
              }}
              onChange={event => this.onChange('telephone', event)}
            />
            <TextField
              id="register-email"
              name="email"
              type="email"
              error={touched.email ? !!errors.email : false}
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
              id="register-password"
              name="password"
              type="password"
              error={touched.password ? !!errors.password : false}
              classes={{ root: classes.marginLoose }}
              fullWidth
              label="Password"
              value={password}
              InputProps={{
                className: classes.marginDense,
                endAdornment: (
                  <InputAdornment position="end">
                    { errors.password
                      && (
                        <>
                          <Button
                            className={classes.passwordHint}
                            aria-owns={openPopover ? 'mouse-over-password-hint' : undefined}
                            aria-haspopup="true"
                            onClick={this.handlePopoverOpen}
                          >
                            <ContactSupportRounded />
                          </Button>
                          <Popover
                            id="mouse-over-password-hint"
                            open={openPopover}
                            anchorEl={anchorEl}
                            onClose={this.handlePopoverClose}
                            disableAutoFocus
                          >
                            rule for register
                          </Popover>
                        </>
                      )}
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
              error={touched.confirmPassword ? !!errors.confirmPassword : false}
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
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  touched: PropTypes.objectOf(PropTypes.any).isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Register;
