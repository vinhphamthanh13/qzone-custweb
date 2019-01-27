import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { FormControl, InputLabel, Input } from '@material-ui/core';
import { Check, Clear } from '@material-ui/icons';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classesType } from 'types/global';
import customInputStyle from './material-dashboard-pro-react/customInputStyle';

function CustomInput({ ...props }) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    white,
    inputRootCustomClasses,
    success,
    value,
  } = props;

  const labelClasses = classNames({
    [` ${classes.labelRootError}`]: error,
    [` ${classes.labelRootSuccess}`]: success && !error,
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
    [classes.whiteUnderline]: white,
  });
  const marginTop = classNames({
    [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
  });
  const inputClasses = classNames({
    [classes.input]: true,
    [classes.whiteInput]: white,
  });
  let formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl,
    );
  } else {
    formControlClasses = classes.formControl;
  }
  let feedbackClasses = classes.feedback;
  let minAttr = '';
  if (inputProps !== undefined) {
    if (inputProps.endAdornment !== undefined) {
      feedbackClasses = `${feedbackClasses} ${classes.feedbackRight}`;
    }
    if (inputProps.type === 'number') {
      if (inputProps.min !== undefined) {
        minAttr = inputProps.min;
      } else {
        minAttr = '';
      }
    }
  }
  return (
    <FormControl {...formControlProps} className={formControlClasses}>
      {labelText !== undefined ? (
        <InputLabel
          className={`${classes.labelRoot} ${labelClasses}`}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
      <Input
        classes={{
          input: inputClasses,
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses,
        }}
        id={id}
        value={value}
        inputProps={{
          min: minAttr,
        }}
        {...inputProps}
      />
      {error ? (
        <Clear className={`${feedbackClasses} ${classes.labelRootError}`} />
      ) : success && (
        <Check className={`${feedbackClasses} ${classes.labelRootSuccess}`} />
      )}
    </FormControl>
  );
}

CustomInput.propTypes = {
  classes: classesType.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.objectOf(PropTypes.object),
  id: PropTypes.string,
  inputProps: PropTypes.shape({
    onChange: PropTypes.func,
  }),
  formControlProps: PropTypes.shape({
    fullWidth: PropTypes.bool,
  }),
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  white: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

CustomInput.defaultProps = {
  labelText: undefined,
  labelProps: {},
  id: '',
  inputProps: {},
  formControlProps: {},
  inputRootCustomClasses: '',
  error: false,
  success: false,
  white: false,
  value: undefined,
};

export default withStyles(customInputStyle)(CustomInput);
