import {
  dangerColor, grayColor, mainColor, mainLinear,
} from 'components/material-dashboard-pro-react';
import checkBox from 'components/material-dashboard-pro-react/customCheckboxRadioSwitch';

const style = theme => ({
  ...checkBox,
  mainLinear,
  authCard: {
    maxWidth: theme.spacing.unit * 46,
    minWidth: theme.spacing.unit * 41,
  },
  marginLoose: {
    margin: `${theme.spacing.unit * 1.25}px auto 0px`,
  },
  authAction: {
    marginBottom: theme.spacing.unit * 2,
  },
  checkboxLabelControl: {
    margin: '0',
  },
  inputAdornment: {
    marginRight: '18px',
    position: 'relative',
  },
  inputAdornmentIconDefault: {
    color: `${grayColor} !important`,
  },
  inputAdornmentIconSuccess: {
    color: mainColor,
  },
  inputAdornmentIconError: {
    color: dangerColor,
  },
  policyAgreement: {
    margin: `${theme.spacing.unit * 1.5}px 0`,
  },
  resetPassword: {
    textAlign: 'right',
    paddingBottom: theme.spacing.unit * 2,
  },
  loginPanel: {
    padding: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 8}px !important`,
  },

  errorModal: {
    position: 'relative',
    margin: 'auto',
    width: 'auto',
    padding: `${theme.spacing.unit * 2}px`,
  },
  root: {
    display: 'flex',
  },
});

export default style;
