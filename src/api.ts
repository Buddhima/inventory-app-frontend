import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { appConfig } from "./config";

export const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
});

api.interceptors.request.use(async (config) => {
  // const token = localStorage.getItem('idToken');

  // console.log('ID Token from localStorage:', token);

  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  const session = await fetchAuthSession({ forceRefresh: true });

  // const accessToken = session.tokens?.accessToken?.toString();
  const idToken = session.tokens?.idToken?.toString();

  if (idToken) {
    console.log("Fetched fresh ID Token:", idToken);

    config.headers.Authorization = `Bearer ${idToken}`;
  } else {
    console.warn("No ID Token available from session");
  }

  return config;
});
