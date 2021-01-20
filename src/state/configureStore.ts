import { createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer, { RootState } from "./rootReducer";

const configureStore = (): Store<RootState> => {
  return createStore(rootReducer, composeWithDevTools());
};

export default configureStore;
