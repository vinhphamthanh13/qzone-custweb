export const AUTH_METHOD = 'auth2';

export const GOOGLE_ID = '1075505092107-j8821j05r48pco773m0mqb16g1po5gtj.apps.googleusercontent.com';

export const AWS_CONFIG = {
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'ap-southeast-2:adab2657-684c-4222-a17a-9a82b6a5ee84',
    // REQUIRED - Amazon Cognito Region
    region: 'ap-southeast-2',
    identityPoolRegion: 'ap-southeast-2',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-southeast-2_0sAegznUX',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '3ov1blo2eji4acnqfcv88tcidn',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,
  },
};
