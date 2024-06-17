import { userActivities } from '@/lib/action';
import UserActivity from '@/components/UserActivity';

const UserActivityPage = async () => {
  const userAct = await userActivities();

  return (
    <div>
      <UserActivity userAct={userAct} />
    </div>
  );
};

export default UserActivityPage;
