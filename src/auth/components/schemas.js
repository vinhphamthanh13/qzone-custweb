import * as Yup from 'yup';
import { regExPattern } from 'utils/constants';

export const registerSchema = Yup.object().shape({
  givenName: Yup
    .string()
    .min(3, 'Given name must have at least 3 characters')
    .required('Given name is Required'),
  telephone: Yup
    .string()
    .matches(regExPattern.phoneNumber, 'Phone number format is not correct')
    .required('Phone number is required'),
  email: Yup
    .string()
    .email('Email is not valid')
    .matches(regExPattern.email, 'Email format is not correct')
    .required('Email is required'),
  password: Yup
    .string()
    .matches(regExPattern.password, 'Password format is not correct')
    .min(8, 'Password must contain at least 8 characters')
    .max(60, 'Password must not be over 60 characters')
    .required('Password is required'),
  confirmPassword: Yup
    .string()
    .oneOf([Yup.ref('password')], 'Confirm password is not matched')
    .required('Confirm password is required'),
  policyAgreement: Yup
    .bool()
    .oneOf([true], 'You have to agree our policy to register a new account')
    .required(),
});

export const loginSchema = Yup.object().shape({
  email: Yup
    .string()
    .email('Email is not valid')
    .matches(regExPattern.email, 'Email format is not correct')
    .required('Email is required'),
  password: Yup
    .string()
    .matches(regExPattern.password, 'Password format is not correct')
    .min(8, 'Password must contain at least 8 characters')
    .max(60, 'Password must not be over 60 characters')
    .required('Password is required'),
});
