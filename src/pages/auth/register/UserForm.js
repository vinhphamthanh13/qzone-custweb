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
import CustomInput from 'components/CustomInput';

const UserForm = (props) => {
  const {
    classes, iconClassName, onSubmitHandler, onChange,
    policyAgreement, isFormValid, onClose,
  } = props;
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
          <CustomInput
            labelText="Given name"
            id="givename"
            formControlProps={{
              fullWidth: true,
              className: classes.marginDense,
            }}
            inputProps={{
              autoFocus: true,
              type: 'text',
              endAdornment: (
                <InputAdornment position="end">
                  <InsertEmoticon className={iconClassName} />
                </InputAdornment>
              ),
            }}
            onChange={event => onChange(event, 'giveName', 'name')}
          />
          <CustomInput
            labelText="Phone number"
            id="phonenumber"
            formControlProps={{
              fullWidth: true,
              className: classes.marginDense,
            }}
            inputProps={{
              type: 'text',
              endAdornment: (
                <InputAdornment position="end">
                  <Call className={iconClassName} />
                </InputAdornment>
              ),
            }}
            onChange={event => onChange(event, 'giveName', 'name')}
          />
          <CustomInput
            labelText="Email"
            id="email"
            formControlProps={{
              fullWidth: true,
              className: classes.marginDense,
            }}
            inputProps={{
              type: 'email',
              endAdornment: (
                <InputAdornment position="end">
                  <Email className={iconClassName} />
                </InputAdornment>
              ),
            }}
            onChange={event => onChange(event, 'email', 'email')}
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
          <CustomInput
            labelText="Confirm password"
            id="registerConfirmPassword"
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
            onChange={event => onChange(event, 'registerConfirmPassword', 'equalTo', 'registerPassword')}
          />
          <FormControlLabel
            control={(
              <Checkbox
                tabIndex={-1}
                onClick={event => onChange(
                  event, 'registerCheckbox', 'checkbox',
                )}
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
              variant="contained"
              color="primary"
              fullWidth
              // onClick={() => this.registerClick()}
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
              Discard
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
  policyAgreement: PropTypes.string.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserForm;
