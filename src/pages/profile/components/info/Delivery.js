import React from 'react';
// import { objectOf, any } from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import s from '../Info.module.scss';

const Delivery = ({
  values, isValid, touched, errors,
  // setFieldValue, setFieldTouched, setFieldError,
  handleChange, handleBlur, handleSubmit,
}) => {
  const isSubmitValid = isValid
    && (touched.givenName || touched.telephone || touched.email || touched.familyName)
    && (!(errors.email && errors.givenName && errors.telephone && errors.familyName));
  const DELIVERY = [
    'street Address', 'district', 'state', 'city', 'post Code', 'country',
  ];

  return (
    <>
      <form onSubmit={handleSubmit}>
        {DELIVERY.map(item => (
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
    streetAddress: '',
    district: '',
    state: '',
    city: '',
    postCode: '',
    country: '',
  }),
  validationSchema: Yup.object().shape({
    streetAddress: Yup.string(),
    district: Yup.string().email(),
    state: Yup.string(),
    city: Yup.string(),
    postCode: Yup.string(),
    country: Yup.string(),
  }),
})(Delivery);
