import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/action";
import { Post } from "@/types/definitions";

const DashboardPage = async () => {
  const posts: Post[] = await getPosts();

  return (
    <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default DashboardPage;
