import React from 'react';
import { TextField, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { isEqual } from 'lodash';
import { withFormik } from 'formik';
import s from '../Info.module.scss';

const Delivery = ({
  initialValues, values, isValid, touched, errors,
  handleChange, handleBlur, handleSubmit,
}) => {
  const DELIVERY = [
    'street Address', 'district', 'state', 'city', 'post Code', 'country',
  ];
  const finalTouched = DELIVERY.reduce((acc, cur) => acc || touched[cur]);
  const finalError = DELIVERY.reduce((acc, cur) => acc && errors[cur]);
  const isSubmitValid = isValid && finalTouched && !finalError
    && !isEqual(JSON.stringify(initialValues), JSON.stringify(values));

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
  mapPropsToValues: props => ({
    'street Address': props.userDetail.address.streetAddress || '',
    district: props.userDetail.address.district || '',
    state: props.userDetail.address.state || '',
    city: props.userDetail.address.city || '',
    'post Code': props.userDetail.address.postCode || '',
    country: props.userDetail.address.country || '',
  }),
  validationSchema: Yup.object().shape({
    'street Address': Yup.string(),
    district: Yup.string().email(),
    state: Yup.string(),
    city: Yup.string(),
    'post Code': Yup.string(),
    country: Yup.string(),
  }),
})(Delivery);
