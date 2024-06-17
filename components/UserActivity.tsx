import PostCard from './PostCard';

export default function UserActivity({ userAct }: any) {
  return (
    <div className="grid grid-cols-1">
      {userAct.map((act) => (
        <PostCard key={act.id} post={act} />
      ))}
    </div>
  );
}
