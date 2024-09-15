// App.tsx
import React from 'react';
import { Admin, Resource } from 'react-admin';
import TicketList from './components/TicketList';
import { dataProvider } from './dataProvider';
import Auth0Provider from './components/Auth0Provider';
import Login from './components/Login'

const App = () => (
  <Auth0Provider>
    <Admin dataProvider={dataProvider} layout={Login}>
      <Resource name="tickets" list={TicketList} />
    </Admin>
  </Auth0Provider>
);

export default App;
