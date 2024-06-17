import { Toaster } from 'react-hot-toast';

import CreateForm from '@/components/CreateForm';

const CreatePost = () => {
  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <CreateForm />
    </div>
  );
};

export default CreatePost;
