import { Toaster } from 'react-hot-toast';

import PostCard from '@/components/PostCard';
import { getPosts } from '@/lib/action';
import { Post } from '@/types/definitions';

const DashboardPage = async () => {
  const posts: Post[] = await getPosts();

  return (
    <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Toaster />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default DashboardPage;
