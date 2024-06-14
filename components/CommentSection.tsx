'use client';
import { useFormState } from 'react-dom';

import Submit from './Submit';

import { CardPostProps, CommentState } from '@/types/definitions';
import { addComment } from '@/lib/action';

export default function CommentSection({ post }: CardPostProps) {
  const initialState: CommentState = { message: null, errors: {} };
  const [state, action] = useFormState<CommentState, FormData>(addComment, initialState);

  return (
    <div>
      <div className="ml-5 h-10 overflow-y-scroll scrollbar-hide">
        {post.comments?.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>{comment.user.username}:</strong> {comment.text}
            </p>
          </div>
        ))}
      </div>
      <form action={action} className="flex items-center justify-around">
        <input
          aria-describedby="comment-error"
          className="mx-1 flex-1 border-none outline-none focus:ring-0"
          name="comment"
          placeholder="Add a comment ..."
          type="text"
        />
        <div aria-atomic="true" aria-live="polite" id="caption-error">
          {state.errors.text &&
            state.errors.text.map((error: string) => (
              <p key={error} className="m-2 text-sm text-red-500">
                {error}
              </p>
            ))}
        </div>
        <Submit color={'primary'} label={'Post'} radius="full" size={'sm'} variant={'light'} />
      </form>
    </div>
  );
}
