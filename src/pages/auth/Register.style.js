import {
  container,
} from 'components/material-dashboard-pro-react';
import customCheckboxRadioSwitch from 'components/material-dashboard-pro-react/customCheckboxRadioSwitch';

const registerPageStyle = {
  ...customCheckboxRadioSwitch,
  textCenter: {
    textAlign: 'center',
  },
  content: {
    position: 'fixed',
    zIndex: '1000',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    ...container,
    position: 'relative',
    zIndex: '3',
    minHeight: 'calc(100vh - 80px)',
    paddingTop: '5%',
  },
  center: {
    textAlign: 'center',
  },
  checkboxLabelControl: {
    margin: '0',
  },
  checkboxLabel: {
    marginLeft: '6px',
    color: 'rgba(0, 0, 0, 0.26)',
  },
};

export default registerPageStyle;
