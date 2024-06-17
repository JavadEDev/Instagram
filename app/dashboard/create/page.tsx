import { Toaster } from 'react-hot-toast';

import CreateForm from '@/components/CreateForm';

const CreatePost = () => {
  return (
    <section className="container mx-auto p-2">
      <Toaster />
      <CreateForm />
    </section>
  );
};

export default CreatePost;
