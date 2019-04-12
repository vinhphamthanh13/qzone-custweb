import React from 'react';
// import { objectOf, any } from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import s from '../Info.module.scss';

const Personal = ({
  values, isValid, touched, errors,
  // setFieldValue, setFieldTouched, setFieldError,
  handleChange, handleBlur, handleSubmit,
}) => {
  // && (touched.givenName || touched.telephone || touched.email || touched.familyName)
  // && (!(errors.email && errors.givenName && errors.telephone && errors.familyName));
  const PERSONAL = ['email', 'telephone', 'given Name', 'family Name'];
  const finalTouched = PERSONAL.reduce((acc, cur) => acc || touched[cur], false);
  const finalError = PERSONAL.reduce((acc, cur) => acc && errors[cur], false);
  const isSubmitValid = isValid && !finalError && finalTouched;
  console.log('finalTouched', finalTouched);
  console.log('finalErrors', finalError);
  console.log('isSubmitValid', isSubmitValid);
  console.log('isValid', isValid);

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
  mapPropsToValues: () => ({
    givenName: '',
    familyName: '',
    email: '',
    telephone: '',
  }),
  validationSchema: Yup.object().shape({
    'given Name': Yup.string().required(),
    email: Yup.string().email().required(),
    telephone: Yup.string().required(),
    'family Name': Yup.string(),
  }),
})(Personal);
