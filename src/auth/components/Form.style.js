import {
  dangerColor, grayColor, mainColor,
} from 'components/material-dashboard-pro-react';
import checkBox from 'components/material-dashboard-pro-react/customCheckboxRadioSwitch';

const style = theme => ({
  ...checkBox,
  registerCard: {
    maxWidth: theme.spacing.unit * 50,
    minWidth: theme.spacing.unit * 41,
  },
  marginLoose: {
    margin: `${theme.spacing.unit * 1.25}px auto 0px`,
  },
  center: {
    textAlign: 'center',
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
  simpleButton: {
    '&:hover': {
      background: 'transparent',
    },
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
