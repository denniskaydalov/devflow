import React from 'react';
import { Auth0Provider as Auth0ProviderReact } from '@auth0/auth0-react';

const Auth0Provider = ({ children }: { children: React.ReactNode }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN as string;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID as string;

  console.log(process.env.REACT_APP_AUTH0_DOMAIN)

  return (
    <Auth0ProviderReact
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      {children}
    </Auth0ProviderReact>
  );
};

export default Auth0Provider;
