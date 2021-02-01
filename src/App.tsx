import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { asProtectedRoute } from './components'
import configureStore from './state/configureStore'
import * as Pages from './pages'

const { store, persister } = configureStore()

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <Router>
          <Switch>
            <Route path="/" exact component={asProtectedRoute(Pages.Dashboard)} />
            <Route path="/sign-in" component={Pages.SignIn} />
            <Route path="/sign-up" component={Pages.SignUp} />
            <Route path="/new-client" component={asProtectedRoute(Pages.CreateClient)} />
            <Route path="/filters" component={asProtectedRoute(Pages.ViewFilters)} />
            <Route path="/new-filter" component={asProtectedRoute(Pages.CreateFilter)} />
            <Route path="/client/:clientId" component={asProtectedRoute(Pages.ViewClient)} />
            <Route component={Pages.NotFound} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
