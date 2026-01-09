import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAuthenticated } from './auth';

export const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    isAuthenticated().then((result) => {
      setAuthed(result);
      setLoading(false);
    });
  }, []);

  if (loading) return null; // or IonLoading

  return (
    <Route
      {...rest}
      render={(props) =>
        authed ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
