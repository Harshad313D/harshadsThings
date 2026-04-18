import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    // Dynamically switches between localhost and your Render backend
        baseUrl: "https://harshadthings-backend.onrender.com/api/v1/users/",
    credentials: "include",
  }),

  tagTypes: ["Stats", "Contacts"],

  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => "stats",
      providesTags: ["Stats"],
    }),

    recordView: builder.mutation({
      query: () => ({
        url: "stats/view",
        method: "POST",
      }),
      invalidatesTags: ["Stats"],
    }),

    toggleLike: builder.mutation({
      query: () => ({
        url: "stats/like",
        method: "POST",
      }),
      invalidatesTags: ["Stats"],
    }),

    addReview: builder.mutation({
      query: (body) => ({
        url: "stats/add-contact",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useGetStatsQuery,
  useToggleLikeMutation,
  useRecordViewMutation,
  useAddReviewMutation,
} = usersApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const UsersApi = createApi({
//   reducerPath: "UsersApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://harshadthings-backend.onrender.com/api/v1/users/",
//     credentials: "include",
//   }),

//   tagTypes: ["Stats", "Contacts"],

//   endpoints: (builder) => ({
//     // Get current views and likes
//     getStats: builder.query({
//       query: () => "stats",
//       providesTags: ["Stats"],
//     }),

//     // Record a new view (Updates 'Stats' cache)
//     recordView: builder.mutation({
//       query: () => ({
//         url: "stats/view",
//         method: "POST",
//       }),
//       invalidatesTags: ["Stats"],
//     }),

//     // Toggle Like (Updates 'Stats' cache)
//     toggleLike: builder.mutation({
//       query: () => ({
//         url: "stats/like",
//         method: "POST",
//       }),
//       invalidatesTags: ["Stats"],
//     }),
//     addReview: builder.mutation({
//       query: (body) => ({
//         url: "stats/add-contact",
//         method: "POST",
//         body: body,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetStatsQuery,
//   useToggleLikeMutation,
//   useRecordViewMutation,
//   useAddReviewMutation,

// } = UsersApi;
