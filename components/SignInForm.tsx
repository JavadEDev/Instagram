"use client";
import React from "react";
import { useFormState } from "react-dom";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import Submit from "./Submit";
import { LockIcon, MailIcon } from "./icons";

import { authenticate } from "@/lib/action";
import { SigninPropsState } from "@/types/definitions";

const SignInForm = () => {
  const initialState: SigninPropsState = { message: null, errors: {} };
  const [state, action] = useFormState<SigninPropsState, FormData>(
    authenticate,
    initialState,
  );

  return (
    <form
      action={action}
      className="bg-content1 border border-default-100 shadow-lg rounded-md p-3 flex flex-col gap-2 "
    >
      <h3 className={`mb-3 font-lusitana text-2xl`}>Sign in</h3>
      <Input
        fullWidth
        required
        aria-describedby="email-error"
        endContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        id="email"
        name="email"
        placeholder="Enter your email address"
        size="lg"
        type="email"
        variant="bordered"
      />
      <Input
        fullWidth
        required
        aria-describedby="password-error"
        endContent={
          <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        id="password"
        minLength={6}
        name="password"
        placeholder="Enter password"
        size="lg"
        type="password"
        variant="bordered"
      />
      <Submit label={"signin"} />
      <div>
        <Link
          className="mx-2 text-sm font-semibold"
          href="/signup"
        >{`Don't have an account?`}</Link>
      </div>
      <div className="flex">
        {state?.emailError && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{state.emailError}</p>
          </>
        )}
        {state?.generalError && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{state.generalError}</p>
          </>
        )}
      </div>
    </form>
  );
};

export default SignInForm;
