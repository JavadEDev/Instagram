'use client';
import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/react';
import Link from 'next/link';

import Submit from './Submit';
import { LockIcon, MailIcon } from './icons';

import { signUp } from '@/lib/action';
import { State } from '@/types/definitions';

const SignUpForm = () => {
  const initialState: State = { message: null, errors: {} };
  const [state, action] = useFormState<State, FormData>(signUp, initialState);

  return (
    <form
      action={action}
      className="flex flex-col gap-2 rounded-md border border-default-100 bg-content1 p-3 shadow-lg"
    >
      <h3 className="my-4 text-2xl">Sign up</h3>
      <Input
        fullWidth
        required
        aria-describedby="email-error"
        endContent={
          <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
        }
        label="Email"
        name="email"
        size="lg"
        variant="bordered"
      />
      <div aria-atomic="true" aria-live="polite" id="email-error">
        {state?.errors?.email &&
          state?.errors?.email.map((error: string) => (
            <p key={error} className="m-2 text-sm text-red-500">
              {error}
            </p>
          ))}
      </div>
      <Input
        fullWidth
        required
        aria-describedby="password-error"
        endContent={
          <LockIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
        }
        label="Password"
        name="password"
        size="lg"
        type="password"
        variant="bordered"
      />
      <div aria-atomic="true" aria-live="polite" id="password-error">
        {state.errors?.password &&
          state.errors?.password.map((error: string) => (
            <p key={error} className="m-2 text-sm text-red-500">
              {error}
            </p>
          ))}
      </div>
      <Submit color={'primary'} label={'signup'} radius={'sm'} size={'md'} variant={'shadow'} />
      <div>
        <Link
          className="mx-2 text-sm font-semibold"
          href="/signin"
        >{`Already have an account?`}</Link>
      </div>
      {state?.message && <p className="mx-2 text-sm text-red-500">{state.message}</p>}
    </form>
  );
};

export default SignUpForm;
