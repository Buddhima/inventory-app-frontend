const awsExports = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_OZ40xwtxd',
      userPoolClientId: '3lf6emv0c419un37unamam1mgu',
      loginWith: {
        oauth: {
          domain: 'ionic-react-auth.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:8100/auth/callback'],
          redirectSignOut: ['http://localhost:8100/'],
          responseType: 'code' as const, // ✅ IMPORTANT
        },
      },
    },
  },
};

export default awsExports;
