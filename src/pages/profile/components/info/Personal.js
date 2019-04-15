import React from 'react';
import { TextField, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { isEqual } from 'lodash';
import { withFormik } from 'formik';
import s from '../Info.module.scss';

const Personal = ({
  values, isValid, touched, errors, initialValues,
  handleChange, handleBlur, handleSubmit, updateStatus,
}) => {
  const PERSONAL = [
    { id: 'email', value: 'email', label: 'Email' },
    { id: 'telephone', value: 'telephone', label: 'Telephone' },
    { id: 'givenName', value: 'givenName', label: 'Given Name' },
    { id: 'familyName', value: 'familyName', label: 'Family Name' },
  ];
  const finalTouched = PERSONAL.reduce((acc, cur) => acc || touched[cur.value], false);
  const finalError = PERSONAL.reduce((acc, cur) => acc && errors[cur.value], false);
  const isSubmitValid = updateStatus === '' && isValid && !finalError && finalTouched
    && !isEqual(JSON.stringify(initialValues), JSON.stringify(values));
  return (
    <>
      <form onSubmit={handleSubmit}>
        {PERSONAL.map(item => (
          <div key={item.id} className={s.formControl}>
            <TextField
              fullWidth
              value={values[item.value]}
              onChange={handleChange}
              onBlur={handleBlur}
              name={item.value}
              label={item.label}
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
    givenName: props.userInfo.givenName,
    familyName: props.userInfo.familyName || '',
    email: props.userInfo.email,
    telephone: props.userInfo.telephone,
  }),
  isInitialValid: true,
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    familyName: Yup.string().min(3),
    givenName: Yup.string().min(3).required(),
    email: Yup.string().email().required(),
    telephone: Yup.string().min(12).required(),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    props.saveInfo(values);
    setSubmitting(false);
  },
})(Personal);
