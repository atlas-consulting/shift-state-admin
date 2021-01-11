import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import routes from './routes'

function App() {
  return (
    <>
      <Router>
        <Switch>
          {false && <Redirect to="/sign-in" />}
          {routes.map(({ name, path, component: Component, exact }) => <Route key={name} path={path} component={Component} exact={exact} />)}
        </Switch>
      </Router>
    </>
  );
}

export default App;
