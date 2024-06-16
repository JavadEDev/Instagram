'use client';

import { useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'react-hot-toast';

import { User } from '@/types/definitions';
import Submit from '@/components/Submit';

interface SettingsProps {
  user: User;
}

const SettingsPage = ({ user }: SettingsProps) => {
  const initialState = { message: null, errors: {} };
  const [state, action] = useFormState(initialState);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (file) {
      formData.append('picture', file);
    }

    await action(formData);
    if (state.message) {
      toast.success(state.message);
    } else {
      Object.values(state.errors).forEach((error) => toast.error(error[0]));
    }
  };

  return (
    <div className="settings-page">
      <form onSubmit={handleSubmit} className="settings-form">
        <div>
          <label>Username</label>
          <input
            name="username"
            defaultValue={user.username || ''}
            placeholder="Username"
            type="text"
          />
        </div>
        <div>
          <label>Password</label>
          <input name="password" placeholder="New Password" type="password" />
        </div>
        <div>
          <label>Bio</label>
          <textarea name="bio" defaultValue={user.bio || ''} placeholder="Bio"></textarea>
        </div>
        <div>
          <label>Picture</label>
          <input ref={fileInputRef} type="file" onChange={handleFileChange} />
        </div>
        <Submit label="Update" />
      </form>
      <div className="hidden">
        {state.message && toast.success(state.message)}
        {state.errors && Object.values(state.errors).map((error) => toast.error(error[0]))}
      </div>
    </div>
  );
};

export default SettingsPage;
