import React from 'react';
import {
  BrowserRouter,
  NavLink,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import MicroFrontend from './MicroFrontend';

const { REACT_APP_SITE_ONE_FRONT_END = '' } = process.env;

const SiteOne = ({ history }: RouteComponentProps<any>) => {
  return (
    <MicroFrontend
      host={REACT_APP_SITE_ONE_FRONT_END}
      name="Site One"
      history={history}
    />
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <header>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/site-one">Sight One</NavLink>
        </header>

        <Switch>
          <Route path="/site-one" component={SiteOne} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
