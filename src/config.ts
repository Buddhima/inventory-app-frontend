const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const appConfig = {
  apiBaseUrl: requireEnv('REACT_APP_API_BASE_URL'),
  awsRegion: requireEnv('REACT_APP_AWS_REGION'),
  cognitoUserPoolId: requireEnv('REACT_APP_COGNITO_USER_POOL_ID'),
  cognitoUserPoolClientId: requireEnv('REACT_APP_COGNITO_USER_POOL_CLIENT_ID'),
  cognitoDomain: requireEnv('REACT_APP_COGNITO_DOMAIN'),
  redirectSignIn: requireEnv('REACT_APP_REDIRECT_SIGN_IN'),
  redirectSignOut: requireEnv('REACT_APP_REDIRECT_SIGN_OUT'),
};
