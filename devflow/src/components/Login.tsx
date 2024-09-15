import { useAuth0 } from '@auth0/auth0-react';
import { Layout, Loading } from 'react-admin';
import LoginButton from './LoginButton';

const Login = (props: any) => {
  const { isAuthenticated, isLoading } = useAuth0();

  console.log(process.env.REACT_APP_AUTH0_DOMAIN)

  if (isLoading) return <Loading />;
  
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoginButton />
      </div>
    );
  }

  return <Layout {...props} />;
};

export default Login;
