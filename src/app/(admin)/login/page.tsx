"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useUserLogin } from "@/hooks/apiHooks"; 
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthToken, setUser } from "@/redux/reducers/authSlice"; 

const LoginComponent = () => {
  const method = useForm();
  const { handleSubmit, register, reset } = method;
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    isError: isLoginError,
    isLoading: isLoginLoading,
    data: loginData,
    error: loginError,
    mutate: login,
  } = useUserLogin();

  useEffect(() => {
    if (loginData && !isLoginLoading) {
      dispatch(setAuthToken(loginData.data.Token));
      dispatch(setUser(loginData.data));
      toast.success(loginData?.message ?? "Login Successful");
      reset();
      router.push("/");
    }
    if (isLoginError) {
      toast.error(loginError as string);
      router.push("/login ");
    }
  }, [loginData, isLoginLoading, loginError, isLoginError, reset, router, dispatch]);

  const onSubmit = (data: { email: string; password: string }) => {
    login(data);
  };
  console.log("login data is comming.....")
  console.log(loginData?.data)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Seamless Login for Exclusive Access
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">
            Immerse yourself in a hassle-free login journey with our intuitively
            designed login form. Effortlessly access your account.
          </p>
          <p className="text-sm mt-12 text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Register here
            </Link>
          </p>
        </div>

        <div className="w-full">
          <h1 className="text-2xl mb-12 text-center">Login here</h1>
          <FormProvider {...method}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-md w-full md:ml-auto space-y-6"
            >
              <div>
                <label className="block mb-1 font-medium">Enter Your Email</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Enter Email"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Enter Your Password</label>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  placeholder="Enter Password"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>

              <div className="!mt-12">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Log in
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
