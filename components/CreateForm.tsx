'use client';
import { Input } from '@nextui-org/input';
import { useFormState } from 'react-dom';
import toast from 'react-hot-toast';

import { createPost } from '@/lib/action';
import Submit from '@/components/Submit';
import { PostState } from '@/types/definitions';

export default function CreateForm() {
  const initialState: PostState = { message: null, errors: {} };
  const [state, action] = useFormState<PostState, FormData>(createPost, initialState);

  return (
    <div>
      <form
        action={action}
        className="flex flex-col gap-2 rounded-md border border-default-100 bg-content1 p-3 shadow-lg"
      >
        <h1 className="mb-4 text-2xl font-bold">Create a New Post</h1>
        <Input
          fullWidth
          required
          accept="image/*"
          aria-describedby="image-error"
          className="mb-4"
          name="imageUrl"
          size="lg"
          type="file"
          variant="flat"
        />
        <div aria-atomic="true" aria-live="polite" id="image-error">
          {state.errors.imageUrl &&
            state.errors.imageUrl.map((error: string) => (
              <p key={error} className="m-2 text-sm text-red-500">
                {error}
              </p>
            ))}
        </div>
        <Input
          aria-describedby="caption-error"
          className="mb-4 p-2"
          label="Caption"
          name="caption"
          size="lg"
          type="text"
          variant="flat"
        />
        <div aria-atomic="true" aria-live="polite" id="caption-error">
          {state.errors.caption &&
            state.errors.caption.map((error: string) => (
              <p key={error} className="m-2 text-sm text-red-500">
                {error}
              </p>
            ))}
        </div>
        <Submit color="success" label={'Upload'} radius={'md'} size={'sm'} variant={'shadow'} />
      </form>
    </div>
  );
}
