import React from 'react';
import { TextField, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { isEqual, get } from 'lodash';
import { withFormik } from 'formik';
import s from '../Info.module.scss';

const Delivery = ({
  initialValues, values, isValid, touched, errors,
  handleChange, handleBlur, handleSubmit, updateStatus,
}) => {
  const DELIVERY = [
    { id: 'streetAddress', value: 'streetAddress', label: 'Street Address' },
    { id: 'district', value: 'district', label: 'District' },
    { id: 'state', value: 'state', label: 'State' },
    { id: 'city', value: 'city', label: 'City' },
    { id: 'postCode', value: 'postCode', label: 'Post Code' },
    { id: 'country', value: 'country', label: 'Country' },
  ];
  const finalTouched = DELIVERY.reduce((acc, cur) => acc || touched[cur.value]);
  const finalError = DELIVERY.reduce((acc, cur) => acc && errors[cur.value]);
  const isSubmitValid = updateStatus === '' && isValid && finalTouched && !finalError
    && !isEqual(JSON.stringify(initialValues), JSON.stringify(values));

  return (
    <>
      <form onSubmit={handleSubmit}>
        {DELIVERY.map(item => (
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
    streetAddress: get(props.userInfo, 'address.streetAddress', ''),
    district: get(props.userInfo, 'address.district', ''),
    state: get(props.userInfo, 'address.state', ''),
    city: get(props.userInfo, 'address.city', ''),
    postCode: get(props.userInfo, 'address.postCode', ''),
    country: get(props.userInfo, 'address.country', ''),
  }),
  validationSchema: Yup.object().shape({
    streetAddress: Yup.string().min(3),
    district: Yup.string().min(3),
    state: Yup.string().min(2),
    city: Yup.string().min(3),
    postCode: Yup.string().min(5),
    country: Yup.string().min(7),
  }),
  handleSubmit: (values, { props }) => props.saveInfo({ address: values }),
})(Delivery);
