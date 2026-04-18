import { configureStore } from "@reduxjs/toolkit";
import { UsersApi } from "./API/UsersAPI";

const store = configureStore({
  reducer: {
    [UsersApi.reducerPath]: UsersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    UsersApi.middleware,
  ],
});

export default store;