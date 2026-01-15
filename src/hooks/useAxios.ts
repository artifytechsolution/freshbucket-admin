// "use client";
// import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
// import { useCallback } from "react";
// import toast from "react-hot-toast";
// import { removeAuthToken, removeUser } from "../redux/reducers/authSlice";
// import { store, useAppDispatch } from "../redux/store";


// // Define the expected error response format
// interface ErrorResponse {
//   status: "error" | "validation" | "warning";
//   message: string;
//   timestamp?: string;
//   stack?: string;
// }

// const useAxios = () => {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const callApi = useCallback(
//     async ({ headers, ...rest }: ApiCallParams): Promise<unknown> => {
//       try {
//         const { authToken } = store?.getState().app.user;
//         console.log("user is comminggggg auth token is comming")
//         console.log(authToken)

//         const { data } = await axios({
//           headers: {
//             "Content-Type": "application/json",
//             ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
//             ...headers,
//           },
//           ...rest,
//           validateStatus: (status) => status >= 200 && status <= 299,
//         });

//         return data;
//       } catch (err) {
//         const axiosError = err as AxiosError<ErrorResponse>;

//         if (axiosError.isAxiosError) {
//           const errorResponse = axiosError.response?.data;

//           if (axiosError.code === "ERR_NETWORK") {
//             dispatch(removeAuthToken());
//             dispatch(removeUser());
//             router.push("/");
//             toast.error(
//               "Server is under maintenance mode. Please try again later."
//             );
//             return;
//           }

//           if (axiosError.response?.status === 401) {
//             dispatch(removeUser());
//             dispatch(removeAuthToken());

//             setTimeout(() => {
//               router.push("/");
//             }, 100);

//             toast.error(
//               errorResponse?.message || "Unauthorized access. Please log in."
//             );
//             return;
//           }

//           if (axiosError.response?.status === 503) {
//             router.replace("/404");
//             toast.error("Service unavailable. Please try again later.");
//             return;
//           }

//           if (errorResponse?.status && errorResponse?.message) {
//             const { status, message } = errorResponse;

//             switch (status) {
//               case "error":
//                 toast.error(message);
//                 break;
//               case "validation":
//                 toast.error(`Validation Error: ${message}`);
//                 break;
//               case "warning":
//                 toast.error(`Warning: ${message}`);
//                 break;
//               default:
//                 toast.error(`Unknown error: ${message}`);
//             }
//             return;
//           }
//         }

//         toast.error("An unexpected error occurred. Please try again.");
//         throw axiosError;
//       }
//     },
//     [dispatch, router]
//   );

//   return callApi;
// };

// export default useAxios;

"use client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { store } from "../redux/store";

// Define the expected error response format
interface ErrorResponse {
  status: "error" | "validation" | "warning";
  message: string;
  timestamp?: string;
  stack?: string;
}

// Define API call params
interface ApiCallParams {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const useAxios = () => {
  const router = useRouter();
  console.log("use axios is callled  ---------------")
  console.log(store?.getState()?.app?.user)
  const callApi = useCallback(
    async ({ headers, ...rest }: ApiCallParams): Promise<unknown> => {
      try {
        const { authToken } =  "cndjcbdjcbdjcbjdbcjdbj";
        console.log("Auth token:", authToken);

        const { data } = await axios({
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
            ...headers,
          },
          ...rest,
          validateStatus: (status) => status >= 200 && status <= 299,
        });

        return data;
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;

        if (axiosError.isAxiosError) {
          const errorResponse = axiosError.response?.data;

          if (axiosError.code === "ERR_NETWORK") {
            toast.error(
              "Server is under maintenance mode. Please try again later."
            );
            return;
          }

          if (axiosError.response?.status === 401) {
            toast.error(
              errorResponse?.message || "Unauthorized access. Please log in."
            );
            // Optionally redirect without clearing token
            router.push("/");
            return;
          }

          if (axiosError.response?.status === 503) {
            router.replace("/404");
            toast.error("Service unavailable. Please try again later.");
            return;
          }

          if (errorResponse?.status && errorResponse?.message) {
            const { status, message } = errorResponse;

            switch (status) {
              case "error":
                toast.error(message);
                break;
              case "validation":
                toast.error(`Validation Error: ${message}`);
                break;
              case "warning":
                toast.error(`Warning: ${message}`);
                break;
              default:
                toast.error(`Unknown error: ${message}`);
            }
            return;
          }
        }

        toast.error("An unexpected error occurred. Please try again.");
        throw axiosError;
      }
    },
    [router]
  );

  return callApi;
};

export default useAxios;

