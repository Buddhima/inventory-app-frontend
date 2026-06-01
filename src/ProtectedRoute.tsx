import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAuthenticated } from './auth';

interface ProtectedRouteProps extends RouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children, ...rest }: ProtectedRouteProps) => {
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
      render={() =>
        authed ? <>{children}</> : <Redirect to="/login" />
      }
    />
  );
};
