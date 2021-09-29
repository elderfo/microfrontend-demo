import React from 'react';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import MicroFrontend from './MicroFrontend';

const { REACT_APP_SITE_ONE_FRONT_END = '', REACT_APP_SITE_TWO_FRONT_END = '' } =
  process.env;

const SiteTwo = () => {
  return <MicroFrontend host={REACT_APP_SITE_TWO_FRONT_END} name="SiteTwo" />;
};

const SiteOne = () => {
  return <MicroFrontend host={REACT_APP_SITE_ONE_FRONT_END} name="SiteOne" />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <header>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/site-one">Site One</NavLink>
            </li>
            <li>
              <NavLink to="/site-two">Site Two</NavLink>
            </li>
          </ul>
        </header>

        <Switch>
          <Route path="/site-one" component={SiteOne} />
          <Route path="/site-two" component={SiteTwo} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
