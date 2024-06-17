import { Toaster } from 'react-hot-toast';

import SettingCard from '@/components/SettingCard';
import { getUserFromDbWithId, getUserId } from '@/lib/action';

const SettingsPage = async () => {
  const userId = await getUserId();
  const userInfo = await getUserFromDbWithId(userId);

  if (!userInfo) return <div>User not found!</div>;

  return (
    <section>
      <Toaster />
      <SettingCard user={userInfo} />
    </section>
  );
};

export default SettingsPage;
