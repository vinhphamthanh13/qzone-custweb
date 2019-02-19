export const AUTH_METHOD = 'auth2';

export const GOOGLE_ID = '166981643559-r54fbu1evv6cpfpphqjtlo4j950vdmvn.apps.googleusercontent.com';

export const AWS_CONFIG = {
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'ap-southeast-2:fae931b0-0397-4d09-99fe-5db825fad329',
    // REQUIRED - Amazon Cognito Region
    region: 'ap-southeast-2',
    identityPoolRegion: 'ap-southeast-2',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-southeast-2_k3Ly7reYV',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '5bip0lat6r7tf023qs5a9qd04p',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,
  },
};
