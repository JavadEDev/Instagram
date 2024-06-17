'use client';

import { useFormState } from 'react-dom';
import { toast } from 'react-hot-toast';
import { Input, Textarea } from '@nextui-org/input';

import { SettingsState, User } from '@/types/definitions';
import Submit from '@/components/Submit';
import { updateUser } from '@/lib/action';

interface SettingsProps {
  user: User;
}

const SettingCard = ({ user }: SettingsProps) => {
  const initialState: SettingsState = { message: null, errors: {} };
  const [state, action] = useFormState<SettingsState, FormData>(updateUser, initialState);

  return (
    <>
      <form
        action={action}
        className="flex flex-col gap-2 rounded-md border border-default-100 bg-content1 p-3 shadow-lg"
      >
        <Input
          fullWidth
          accept="image/*"
          aria-describedby="picture-error"
          className="mb-4"
          name="picture"
          size="lg"
          type="file"
          variant="flat"
        />
        <Input
          fullWidth
          isReadOnly
          defaultValue={user?.email}
          label="Email"
          name="email"
          size="lg"
          type="email"
          variant="bordered"
        />
        <Input
          fullWidth
          aria-describedby="username-error"
          defaultValue={user.username || ''}
          label="Username"
          name="username"
          size="lg"
          type="text"
          variant="bordered"
        />
        <Input
          fullWidth
          aria-describedby="password-error"
          label="Your Password"
          name="password"
          placeholder="Old Password"
          size="lg"
          type="password"
          variant="bordered"
        />
        <Input
          fullWidth
          aria-describedby="newpassword-error"
          label="New Password"
          name="newpassword"
          placeholder="New Password"
          size="lg"
          type="password"
          variant="bordered"
        />
        <Textarea
          defaultValue={user.bio || ''}
          label="Bio"
          maxRows={2}
          name="bio"
          placeholder="Enter your Bio"
        />
        <Submit color={'success'} label="Update" radius={'sm'} size={'sm'} variant={'shadow'} />
      </form>
      <div className="hidden">
        {state.message && toast.success(state.message)}
        {state.errors && Object.values(state.errors).map((error) => toast.error(error[0]))}
      </div>
    </>
  );
};

export default SettingCard;
