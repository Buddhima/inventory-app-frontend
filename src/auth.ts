import { fetchAuthSession } from 'aws-amplify/auth';

type TokenPayload = {
  [key: string]: unknown;
};

export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await fetchAuthSession();
    return !!session.tokens?.accessToken;
  } catch {
    return false;
  }
}

export async function isInGroup(groupName: string): Promise<boolean> {
  try {
    const session = await fetchAuthSession();
    const idTokenPayload = session.tokens?.idToken?.payload as TokenPayload | undefined;
    const accessTokenPayload = session.tokens?.accessToken?.payload as TokenPayload | undefined;
    const groups = idTokenPayload?.['cognito:groups'] ?? accessTokenPayload?.['cognito:groups'];

    if (Array.isArray(groups)) {
      return groups.includes(groupName);
    }

    if (typeof groups === 'string') {
      return groups.split(',').map((group) => group.trim()).includes(groupName);
    }

    return false;
  } catch {
    return false;
  }
}
