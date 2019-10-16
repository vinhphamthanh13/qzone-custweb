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
    .oneOf([Yup.ref('password')], 'Confirmed password is not matched')
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

export const forgotPasswordSchema = Yup.object().shape({
  code: Yup
    .string()
    .matches(regExPattern.registerVerificationCode, 'Code is must be 6 digits')
    .required('Verification code is required'),
  password: Yup
    .string()
    .matches(regExPattern.password, 'Password format is not correct')
    .min(8, 'Password must contain at least 8 characters')
    .max(60, 'Password must not be over 60 characters')
    .required('Password is required'),
  confirmPassword: Yup
    .string()
    .oneOf([Yup.ref('password')], 'Confirmed password is not matched')
    .required('Confirm password is required'),
});

export const clientInfo = Yup.object().shape({
  userName: Yup
    .string()
    .matches(regExPattern.userName, { message: 'Name is too short'})
    .required('User name cannot be blank'),
  userEmail: Yup
    .string()
    .matches(regExPattern.email, { message: 'Email address is invalid' })
    .required('Email cannot be blank'),
  phoneNumber: Yup
    .string()
    .matches(regExPattern.phoneNumber, { message: 'Phone number is invalid' })
    .required('Phone number cannot be blank'),
  familyName: Yup
    .string()
    .matches(regExPattern.userName, { message: 'Sure name is too short'}),
  streetAddress: Yup.string().matches(regExPattern.address, { message: 'Street address is too short'}),
  district: Yup.string().matches(regExPattern.address, { message: 'District is too short'}),
  state: Yup.string().matches(regExPattern.address, { message: 'State name is too short'}),
  city: Yup.string().matches(regExPattern.address, { message: 'City is too short'}),
  postCode: Yup.string().matches(regExPattern.address, { message: 'Post code is too short'}),
  country: Yup.string().matches(regExPattern.address, { message: 'Country name is too short'}),
});
