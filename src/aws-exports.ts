import { appConfig } from './config';

const awsExports = {
  Auth: {
    Cognito: {
      region: appConfig.awsRegion,
      userPoolId: appConfig.cognitoUserPoolId,
      userPoolClientId: appConfig.cognitoUserPoolClientId,
      loginWith: {
        oauth: {
          domain: appConfig.cognitoDomain,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [appConfig.redirectSignIn],
          redirectSignOut: [appConfig.redirectSignOut],
          responseType: 'code' as const,
        },
      },
    },
  },
};

export default awsExports;
