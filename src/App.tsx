import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { asProtectedRoute } from './components'
import configureStore from './state/configureStore'
import * as Pages from './pages'

function App() {
  return (
    <Provider store={configureStore()}>
      <Router>
        <Switch>
          <Route path="/" exact component={asProtectedRoute(Pages.Dashboard)} />
          <Route path="/sign-in" component={Pages.SignIn} />
          <Route path="/sign-up" component={Pages.SignUp} />
          <Route path="/new-client" component={asProtectedRoute(Pages.CreateClient)} />
          <Route path="/client/:clientId" component={asProtectedRoute(Pages.ViewClient)} />
          <Route component={Pages.NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
