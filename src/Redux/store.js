import { configureStore } from "@reduxjs/toolkit";
// Using the path alias for a clean, absolute import

const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    usersApi.middleware,
  ],
});

export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { UsersApi } from "./API/UsersAPI";

// const store = configureStore({
//   reducer: {
//     [UsersApi.reducerPath]: UsersApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) => [
//     ...getDefaultMiddleware(),
//     UsersApi.middleware,
//   ],
// });

// export default store;
