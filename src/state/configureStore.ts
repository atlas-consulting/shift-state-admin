import { createStore } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const configureStore = () => {
  const store = createStore(persistedReducer, composeWithDevTools());
  const persister = persistStore(store);
  return { store, persister };
};

export default configureStore;
