import React from 'react';
import { TextField, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { isEqual } from 'lodash';
import { withFormik } from 'formik';
import s from '../Info.module.scss';

const Personal = ({
  values, isValid, touched, errors, initialValues,
  handleChange, handleBlur, handleSubmit,
}) => {
  console.log('initialValues', initialValues);
  // && (touched.givenName || touched.telephone || touched.email || touched.familyName)
  // && (!(errors.email && errors.givenName && errors.telephone && errors.familyName));
  const PERSONAL = ['email', 'telephone', 'given Name', 'family Name'];
  const finalTouched = PERSONAL.reduce((acc, cur) => acc || touched[cur], false);
  const finalError = PERSONAL.reduce((acc, cur) => acc && errors[cur], false);
  const isSubmitValid = isValid && !finalError && finalTouched
    && !isEqual(JSON.stringify(initialValues), JSON.stringify(values));
  console.log('values', values);
  console.log('isValid', isValid);
  console.log('touched', touched);
  console.log('errors', errors);
  return (
    <>
      <form onSubmit={handleSubmit}>
        {PERSONAL.map(item => (
          <div key={item} className={s.formControl}>
            <TextField
              fullWidth
              value={values[item]}
              onChange={handleChange}
              onBlur={handleBlur}
              name={item}
              label={item.toUpperCase()}
            />
          </div>
        ))}
      </form>
      <div className={s.personalCta}>
        <Button
          disabled={!isSubmitValid}
          onClick={handleSubmit}
          className="main-button"
          variant="outlined"
        >Save changes
        </Button>
      </div>
    </>
  );
};

export default withFormik({
  mapPropsToValues: props => ({
    'given Name': props.userDetail.givenName,
    'family Name': props.userDetail.familyName || '',
    email: props.userDetail.email,
    telephone: props.userDetail.telephone,
  }),
  isInitialValid: true,
  validationSchema: Yup.object().shape({
    'given Name': Yup.string().required(),
    email: Yup.string().email().required(),
    telephone: Yup.string().required(),
    'family Name': Yup.string(),
  }),
})(Personal);
