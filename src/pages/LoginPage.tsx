import React from 'react';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { signUp, SignUpInput } from 'aws-amplify/auth';
import { useIonRouter } from '@ionic/react';

import '@aws-amplify/ui-react/styles.css';

import awsExports from '../aws-exports';

Amplify.configure(awsExports);

const LoginPage = () => {
    const router = useIonRouter();

    const services = {
        async handleSignUp(input: SignUpInput) {
            // custom username and email
            const { username, password, options } = input;
            const customUsername = username.toLowerCase();
            const customEmail = options?.userAttributes?.email?.toLowerCase();
            return signUp({
                username: customUsername,
                password,
                options: {
                    ...input.options,
                    userAttributes: {
                        ...input.options?.userAttributes,
                        email: customEmail,
                    },
                },
            });
        },
    };

    const handlePostSignIn = async () => {
        try {
//             // Get JWT tokens
//             const session = await fetchAuthSession();
//             const idToken = session.tokens?.idToken?.toString();
//             const accessToken = session.tokens?.accessToken?.toString();

//             console.log(`Retrieving new tokens after sign-in:
//   ID Token: ${idToken}
//   Access Token: ${accessToken}
// `);

//             // Store tokens (localStorage, or use a secure storage plugin in production)
//             localStorage.setItem('idToken', idToken || '');
//             localStorage.setItem('accessToken', accessToken || '');

            // Redirect to home page
            router.push('/home', 'forward', 'replace');
        } catch (err) {
            console.error('Error fetching tokens:', err);
        }
    };

    return (

        <Authenticator services={services}>
            {({ signOut, user }) => {
                // Automatically handle post-sign-in once user exists
                if (user) handlePostSignIn();

                return (
                    <main>
                        <h1>Hello, {user?.username}</h1>
                        <button onClick={signOut}>Sign Out</button>
                    </main>
                );
            }}
        </Authenticator>
    );
};

export default LoginPage;
