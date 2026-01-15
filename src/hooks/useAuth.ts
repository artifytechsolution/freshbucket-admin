"use client";

import { selectAuthToken, selectUser } from "@/redux/reducers/authSlice";
import { useAppSelector } from "@/redux/store"; 

const useAuth = () => {
  const authToken = useAppSelector(selectAuthToken);
  const user = useAppSelector(selectUser);
  const newToken = user?.token?.acessToken
  console.log("user is commminggggggg ------------------------")
  console.log(user)
  // console.log("select auth token is heerererer")
  // console.log(user?.token?.acessToken)

  const isLoggedIn = !!newToken;
  console.log("hello login is here");
  //const modelType = user?.modelType ?? null;

  return { isLoggedIn, user };
};

export default useAuth;
