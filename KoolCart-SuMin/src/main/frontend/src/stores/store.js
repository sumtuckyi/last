import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dataSlice from "../redux/dataSlice";
import userSlice from "../redux/userSlice";
import cartSlice from "../redux/cartSlice";


const dataPersistConfig = {
  key: "data",
  storage,
}

const userPersistConfig = {
  key: "user",
  storage,
}

const CartPersistConfig = {
  key: "cart",
  storage,
}

const persistedReducer = persistReducer(dataPersistConfig, dataSlice);
const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
const persistedCartReducer = persistReducer(CartPersistConfig, cartSlice);

export const store = configureStore({
  reducer: {
    data: persistedReducer,
    user: persistedUserReducer,
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check
    })
});

export const persistor = persistStore(store);
