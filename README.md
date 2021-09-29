# Micro Frontend Demo

## Setup

### Prereqs

1. Install [node](https://nodejs.org/)
   ```bash
   choco install nodejs.install
   ```
2. Install [yarn](https://yarnpkg.org) package manager
   ```bash
   choco install yarn
   ```

### Install dependencies

In the `microfrontend-demo` folder, run:

```bash
microfrontend-demo> yarn install
```

### Run application

```bash
microfrontend-demo> yarn start
```

Browse to the application:

- Container: http://localhost:3000
- Site One: http://localhost:9001
- Site Two: http://localhost:9002

# Adding a new site

Steps:

1. [Create the new site](#create-the-new-site)
2. [Configure site to be used as a Yarn workspace](#configure-site-to-be-used-as-a-yarn-workspace)
3. [Add `site-two` scripts to main package.json](#add-site-two-scripts-to-main-package.json)
4. [Add `site-two` to the main startup script](#add-site-two-to-the-main-startup-script)
5. [Prepare `site-two` code to be a micro frontend](#prepare-site-two-code-to-be-a-micro-frontend)
6. [Prepare the `container` to display `site-two`](#prepare-the-container-to-display-site-two)

## Create the new site

In `packages/` folder, create the new site.

```bash
microfrontend-demo> cd packages
microfrontend-demo/packages> yarn create react-app site-two --template=typescript
```

This site should be setup in `packages/site-two`.

## Configure site to be used as a Yarn workspace

In `packages/site-two/package.json` change the `name` property to `@microfrontend-demo/site-two`.

```jsonc
{
  "name": "@microfrontend-demo/site-two",
  "version": "0.1.0"
  // ...
}
```

## Add `site-two` scripts to main package.json

In `./package.json` add the following to the `scripts`.

```jsonc
{
  // ...
  "scripts": {
    //...
    "site-two:start": "yarn workspace @microfrontend-demo/site-two start",
    "site-two": "yarn workspace @microfrontend-demo/site-two"
  }
}
```

Script puropses:

- `site-two` is a utility script that can be used to run commands on the `site-two` package
- It's most usefule when adding packages. `site-two:start` starts the dev server for `site-two`

## Add `site-two` to the main startup script

In `./package.json` update the `start` script to include `site-two`.

```jsonc
{
  // ...
  "scripts": {
    //...
    "start": "concurrently -n site-one,site-two,container \"yarn site-one:start\" \"yarn site-two:start\" \"yarn container:start\""
  }
}
```

This project uses [concurrently](https://www.npmjs.com/package/concurrently) to run multiple commands in parallel. It uses the `-n` command line parameter to name each of the scripts it is running. This is simply to make sense of the CLI output.

## Prepare `site-two` code to be a micro frontend

1.  Create a file for the environment variables to configure the site. in the `packages/site-two` folder, create a file `.env.development` and add the following:
    ```
    PORT=9002
    BROWSER=none
    ```
    - `PORT=9002` change the port the site will run on to 9002
    - `BROWSER=none` prevents the browser from being launched by default
2.  Setup dev server to accept cross origin requests by creating the file `packages/site-two/src/setupProxy.js` and adding the following:
    ```js
    module.exports = (app) => {
      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        next();
      });
    };
    ```
3.  Update `packages/site-two/src/index.tsx` to be a micro frontend

    ```typescript
    import ReactDOM from 'react-dom';
    import App from './App';
    import reportWebVitals from './reportWebVitals';

    // render micro frontend function
    window.renderSiteTwo = (containerId: string) => {
      ReactDOM.render(<App />, document.getElementById(containerId));
    };

    // unmount micro frontend function
    window.unmountSiteTwo = (containerId: string) => {
      const element = document.getElementById(containerId);

      if (element) {
        ReactDOM.unmountComponentAtNode(element);
      }
    };
    ```

    Naming here is extremely important as it's used by the Container. In this case, we are naming our micro frontend `SiteTwo` so the container id is going to be `SiteTwo-container` and our methods to mount/unmount are `window.renderSiteTwo` and `window.unmountSiteTwo` respectively.

    Add the following to mount the site to the root node so it can be developed in isolation of the rest of the application.

    ```typescript
    if (!document.getElementById('SiteTwo-container')) {
      ReactDOM.render(<App />, document.getElementById('root'));
    }
    ```

    _Note:_ TypeScript will show errors for the methods specified above.
    ![Unrecog](images\function-not-recognized.png)

    To fix this, create a file `packages/site-two/global.t.ds` and add the following:

    ```typescript
    declare global {
      interface Window {
        renderSiteTwo: any;
        unmountSiteTwo: any;
      }
    }

    // this is required for the file to be recognized
    export {};
    ```

## Prepare the `container` to display `site-two`

1. Add the new site's URL to an environment variable in the `container` project. Add the following to `packages/container/.env.development`
   ```
   REACT_APP_SITE_TWO_FRONT_END=http://localhost:9002
   ```
2. Add the micro frontend for `site-two` in `packages/container/src/App.tsx`

   ```js
   // Import the environment variable for site two
   const {
     // ...
     REACT_APP_SITE_TWO_FRONT_END = '',
   } = process.env;

   const SiteTwo = () => {
     return (
       <MicroFrontend host={REACT_APP_SITE_TWO_FRONT_END} name="SiteTwo" />
     );
   };
   ```

3. Add the route to `site-two` to the `container` application in `packages/container/src/App.tsx`

   ```typescript
   <Switch>
     <Route path="/site-one" component={SiteOne} />
     <Route path="/site-two" component={SiteTwo} />
   </Switch>
   ```

4. Add a link to `site-two` to the `container` application in `packages/container/src/App.tsx`

   ```typescript
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
   ```

5. Start the application and browse to http://localhost:3000

   ```bash
   microfrontend-demo> yarn start
   ```
