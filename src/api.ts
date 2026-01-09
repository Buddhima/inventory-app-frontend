import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

export const api = axios.create({
  baseURL: "https://by5brcdq48.execute-api.us-east-1.amazonaws.com/prod",
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
