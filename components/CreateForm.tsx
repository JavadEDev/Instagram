"use client";
import { Input } from "@nextui-org/input";
import { useFormState } from "react-dom";

import { createPost } from "@/lib/action";
import Submit from "@/components/Submit";
import { PostState } from "@/types/definitions";

export default function CreateForm() {
  const initialState: PostState = { message: null, errors: {} };
  const [state, action] = useFormState<PostState, FormData>(
    createPost,
    initialState,
  );

  return (
    <div>
      <form
        action={action}
        className="bg-content1 border border-default-100 shadow-lg rounded-md p-3 flex flex-col gap-2 "
      >
        <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
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
        <Submit label={"Upload"} />
      </form>
    </div>
  );
}
