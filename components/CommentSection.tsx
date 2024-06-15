'use client';
import { useFormState } from 'react-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useRef } from 'react';
import Moment from 'react-moment';

import Submit from './Submit';

import { CardPostProps, CommentState } from '@/types/definitions';
import { addComment } from '@/lib/action';

export default function CommentSection({ post }: CardPostProps) {
  const initialState: CommentState = { message: null, errors: {} };
  const [state, action] = useFormState<CommentState, FormData>(addComment, initialState);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await action(formData);
    if (commentInputRef.current) {
      commentInputRef.current.value = '';
    }
  };

  return (
    <div className="mx-2">
      {!!post.comments?.length && (
        <div className="ml-2 h-20 overflow-y-scroll scrollbar-hide">
          {post.comments?.map((comment) => (
            <div key={comment.id}>
              <small className="flex flex-wrap">
                <div className="flex-1">
                  <strong>{comment.user?.username}:</strong> {comment.text}
                </div>
                <Moment fromNow className=" ">
                  {post.createdAt}
                </Moment>
              </small>
            </div>
          ))}
        </div>
      )}
      <form className="mt-2 grid grid-cols-5" onSubmit={handleSubmit}>
        <input className="hidden" defaultValue={post.id} name="postId" type="number" />
        <input
          ref={commentInputRef}
          className="col-span-4 mx-1 border-none outline-none focus:ring-0"
          id={`comment-input-${post.id}`}
          name="comment"
          placeholder="Add a comment ..."
          type="text"
        />
        <div className="col-span-1 w-4 place-self-end">
          <Submit
            color={'primary'}
            isIconOnly={true}
            label={<PaperAirplaneIcon className="w-6 -rotate-45" />}
            radius="full"
            size={'sm'}
            variant={'light'}
          />
        </div>
      </form>
      <div className="hidden">
        {state.message && toast.success(state.message)}
        {state.errors?.comment && state.errors?.comment.map((error: string) => toast.error(error))}
      </div>
    </div>
  );
}
