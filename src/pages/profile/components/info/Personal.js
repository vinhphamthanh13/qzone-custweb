import React, { Component } from 'react';
import { objectOf, any, func, bool } from 'prop-types';
import get from 'lodash/get';
import { TextField, Button } from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import { withFormik } from 'formik';
import { clientInfo } from 'authentication/components/schemas';
import s from '../Info.module.scss';

class Personal extends Component {
  static propTypes = {
    initialValues: objectOf(any).isRequired,
    values: objectOf(any).isRequired,
    isValid: bool.isRequired,
    touched: objectOf(any).isRequired,
    errors: objectOf(any).isRequired,
    authHeaders: objectOf(any),
    handleChange: func.isRequired,
    handleBlur: func.isRequired,
    handleSubmit: func.isRequired,
    updateInfo: func.isRequired,
  };

  static defaultProps = {
    authHeaders: {},
  };

  state = {
    userDetail: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { userDetail } = props;
    const { userDetail: cachedUserDetail } = state;
    const updatedState = {};
    if (
      userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  handleSubmit = () => {
    const { values, authHeaders, updateInfo } = this.props;
    const { userDetail } = this.state;
    const id = get(userDetail, 'userSub') || get(userDetail, 'id');
    const givenName = get(values, 'userName');
    const email = get(values, 'userEmail');
    const telephone = get(values, 'userPhone');
    updateInfo({ id, email, telephone, givenName }, authHeaders);
  };

  render () {
    const { initialValues, values, handleBlur, handleChange, handleSubmit, isValid, touched, errors } = this.props;
    const PERSONAL = [
      { id: 'email', value: 'userEmail', label: 'Email' },
      { id: 'telephone', value: 'phoneNumber', label: 'Telephone' },
      { id: 'givenName', value: 'userName', label: 'Given Name' },
      { id: 'familyName', value: 'familyName', label: 'Family Name' },
    ];
    const finalTouched = PERSONAL.reduce((acc, cur) => acc || touched[cur.value], false);
    const finalError = PERSONAL.reduce((acc, cur) => acc && errors[cur.value], false);
    const isSubmitValid = isValid && !finalError && finalTouched
      && JSON.stringify(initialValues) !== JSON.stringify(values);
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          {PERSONAL.map(item => (
            <div key={item.id} className={s.formControl}>
              <TextField
                fullWidth
                value={values[item.value]}
                onChange={handleChange}
                onBlur={handleBlur}
                name={item.value}
                label={item.label}
                error={!!errors[item.value]}
                helperText={errors[item.value]}
              />
            </div>
          ))}
        </form>
        <div className={s.personalCta}>
          <Button
            disabled={!isSubmitValid}
            onClick={handleSubmit}
            variant="outlined"
          ><CheckCircle color="inherit" className="icon-small" />
          <span>&nbsp;Save</span>
          </Button>
        </div>
      </>
    );
  }
}

export default withFormik({
  mapPropsToValues: props => {
    const userName = get(props, 'userDetail.givenName');
    const userEmail = get(props, 'userDetail.email');
    const phoneNumber = get(props, 'userDetail.telephone');
    const familyName = get(props, 'userDetail.familyName');
    return ({
      userName,
      familyName,
      userEmail,
      phoneNumber,
    });
  },
  isInitialValid: true,
  enableReinitialize: true,
  validationSchema: clientInfo,
  validateOnChange: true,
  validateOnBlur: true,
})(Personal);
