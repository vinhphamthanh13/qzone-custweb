import React, { Component } from 'react';
import {
  func, string, bool, objectOf, any,
} from 'prop-types';
import { classesType, socialLoginType } from 'types/global';
import {
  Typography, InputAdornment, Button, Checkbox, FormControlLabel, TextField,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Call, Check, Email, InsertEmoticon, Lock as LockOutline, LockOpen,
} from '@material-ui/icons';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { POPOVER_TYPE } from 'utils/constants';
import SocialAccountsLogin from './SocialAccountsLogin';
import PolicyPopover from './PolicyPopover';
import ForgotPassword from './ForgotPassword';
import s from './Form.style';

export const resolveIconClassName = (name, value, errors, touched) => {
  switch (value) {
    case '':
      return touched[name] ? 'danger-color' : 'default-color';
    default:
      return errors[name] ? 'danger-color' : 'success-color';
  }
};

const LOGIN = 'login';
const REGISTER = 'register';
const CLOSE_AUTH = {
  isLoginOpen: 'isRegisterOpen',
  isRegisterOpen: 'isLoginOpen',
};

const FIELD_IDS = {
  NAME: 'given-name',
  TEL: 'telephone',
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirm-password',
};

const regIdRegEx = /given-name|telephone|confirm-password/i;

class Form extends Component {
  onChange = (name, event) => {
    event.persist();
    const { handleChange, setFieldTouched } = this.props;
    const { target: { value } } = event;
    if (!/^\S+$/.test(value) && value.length) return;
    handleChange(event);
    setFieldTouched(name, true, false);
  };

  handleAuth = (authType) => {
    const { handleAuthenticate, onClose } = this.props;
    onClose(CLOSE_AUTH[authType]);
    handleAuthenticate(authType);
  };

  render() {
    const {
      formType, socialActions, classes, onClose, values: {
        givenName,
        telephone,
        email,
        password,
        confirmPassword,
      },
      handleSubmit,
      errors, touched, isValid,
    } = this.props;
    const resolvedPassword = formType === REGISTER
      ? { name: 'confirmPassword', value: confirmPassword }
      : { name: 'password', value: password };
    const passwordMatched = (errors.confirmPassword && touched.confirmPassword) || (errors.password && touched.password)
      ? (
        <LockOpen
          className={resolveIconClassName(resolvedPassword.name, resolvedPassword.value, errors, touched, classes)}
        />) : (
          <LockOutline
            className={
              resolveIconClassName(resolvedPassword.name, resolvedPassword.value, errors, touched, classes)
            }
          />);
    const fields = [
      {
        id: FIELD_IDS.NAME,
        type: 'text',
        name: 'givenName',
        label: 'Given name',
        value: givenName || '',
        icon: InsertEmoticon,
      },
      {
        id: FIELD_IDS.TEL,
        type: 'tel',
        name: 'telephone',
        label: 'Phone number',
        value: telephone || '',
        icon: Call,
      },
      {
        id: FIELD_IDS.EMAIL,
        type: 'email',
        name: 'email',
        label: 'Email',
        value: email,
        icon: Email,
      },
      {
        id: FIELD_IDS.PASSWORD,
        type: 'password',
        name: 'password',
        label: 'Password',
        value: password,
        icon: LockOutline,
      },
      {
        id: FIELD_IDS.CONFIRM_PASSWORD,
        type: 'password',
        name: 'confirmPassword',
        label: 'Confirm password',
        value: confirmPassword || '',
      },
    ];
    const renderedForm = fields.map((field) => {
      let displayField = null;
      if (regIdRegEx.test(field.id)) {
        displayField = formType === REGISTER ? (
          <TextField
            key={field.id}
            id={field.id}
            type={field.type}
            name={field.name}
            label={field.label}
            value={field.value}
            fullWidth
            autoFocus={formType === REGISTER && field.id === FIELD_IDS.NAME}
            classes={{ root: classes.marginLoose }}
            error={touched[field.name] ? !!errors[field.name] : false}
            InputProps={{
              className: classes.marginDense,
              endAdornment: (
                <InputAdornment position="end">
                  {
                    field.id === FIELD_IDS.TEL
                    && errors[FIELD_IDS.TEL]
                    && touched[FIELD_IDS.TEL]
                    && <PolicyPopover type={POPOVER_TYPE.TEL} />
                  }
                  {field.id === FIELD_IDS.CONFIRM_PASSWORD ? passwordMatched : (
                    <field.icon
                      className={resolveIconClassName(field.name, field.value, errors, touched, classes)}
                    />
                  )
                  }
                </InputAdornment>
              ),
            }}
            onChange={event => this.onChange(field.name, event)}
          />
        ) : null;
      } else {
        displayField = (
          <TextField
            key={field.id}
            id={field.id}
            type={field.type}
            name={field.name}
            label={field.label}
            value={field.value}
            fullWidth
            autoFocus={formType === LOGIN && field.id === FIELD_IDS.EMAIL}
            classes={{ root: classes.marginLoose }}
            error={touched[field.name] ? !!errors[field.name] : false}
            InputProps={{
              className: classes.marginDense,
              endAdornment: (
                <InputAdornment position="end">
                  {
                    field.id === FIELD_IDS.PASSWORD
                    && errors[FIELD_IDS.PASSWORD]
                    && touched[FIELD_IDS.PASSWORD]
                    && <PolicyPopover type={POPOVER_TYPE.PASSWORD} />
                  }
                  <field.icon
                    className={resolveIconClassName(field.name, field.value, errors, touched, classes)}
                  />
                </InputAdornment>
              ),
            }}
            onChange={event => this.onChange(field.name, event)}
          />
        );
      }
      return displayField;
    });

    return (
      <form onSubmit={handleSubmit}>
        <Card className={classes.authCard}>
          <CardHeader
            className={
              `text-center
               ${formType === LOGIN ? classes.loginPanel : ''}`}
            color="main"
          >
            <Typography variant="h5" color="inherit">{formType === REGISTER ? 'Register' : 'Login'}</Typography>
            { formType === LOGIN && <SocialAccountsLogin actions={socialActions} />}
          </CardHeader>
          <CardBody>
            { renderedForm }
            { formType === LOGIN && <ForgotPassword email={email} /> }
            { formType === REGISTER && (
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
            )}
            <div className={`text-center ${classes.authAction}`}>
              <Button
                variant="contained"
                className={!isValid ? '' : 'main-button-active'}
                fullWidth
                disabled={!isValid}
                type="submit"
              >
                {formType === REGISTER ? 'Submit' : 'Let\'s Go'}
              </Button>
              <Button
                color="primary"
                variant="text"
                disableRipple
                className="simple-button"
                onClick={onClose}
              >
                {formType === REGISTER ? 'Discard' : 'Close'}
              </Button>
            </div>
            { formType === LOGIN ? (
              <div className="text-center flex h-center">
                <Typography variant="body2" color="secondary">
                  Do not have an account?
                </Typography>
                <Typography
                  onClick={() => this.handleAuth('isRegisterOpen')}
                  variant="subheading"
                  color="primary"
                  className="hover-pointer fit-button button-text-center"
                >
                  Register Now!
                </Typography>
              </div>
            ) : (
              <div className="text-center flex h-center">
                <Typography variant="body2" color="secondary">
                  Already have an account!
                </Typography>
                <Typography
                  onClick={() => this.handleAuth('isLoginOpen')}
                  variant="subheading"
                  color="primary"
                  className="hover-pointer fit-button button-text-center"
                >
                  Login
                </Typography>
              </div>
            )}
          </CardBody>
        </Card>
      </form>
    );
  }
}

Form.propTypes = {
  classes: classesType.isRequired,
  handleSubmit: func.isRequired,
  onClose: func.isRequired,
  handleChange: func.isRequired,
  isValid: bool.isRequired,
  errors: objectOf(any).isRequired,
  touched: objectOf(any).isRequired,
  setFieldTouched: func.isRequired,
  values: objectOf(any).isRequired,
  formType: string,
  socialActions: socialLoginType,
  handleAuthenticate: func,
};

Form.defaultProps = {
  formType: LOGIN,
  socialActions: {
    twitter: () => {},
    facebook: () => {},
    google: () => {},
  },
  handleAuthenticate: () => {},
};

export default withStyles(s)(Form);
