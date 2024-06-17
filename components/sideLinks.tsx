'use client';
import {
  BeakerIcon,
  ChatBubbleBottomCenterIcon,
  CogIcon,
  DocumentPlusIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@nextui-org/theme';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links = [
  { route: '/dashboard', name: 'Home', icon: HomeIcon },
  { route: '/dashboard/activity', name: 'Your Activity', icon: BeakerIcon },
  {
    route: '/dashboard/messages',
    name: 'Messages',
    icon: ChatBubbleBottomCenterIcon,
  },
  { route: '/dashboard/create', name: 'Create', icon: DocumentPlusIcon },
  { route: '/dashboard/settings', name: 'Settings', icon: CogIcon },
];
const isActive = (path: string, route: string) => {
  if (route === '/dashboard') {
    return path === '/dashboard';
  } else {
    return path.includes(route);
  }
};

export default function SideLinks() {
  const path = usePathname();
  const activeClass = 'bg-primary font-extrabold';

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        return (
          <Link
            key={link.name}
            className={cn(
              `flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3`,
              isActive(path, link.route) && activeClass,
            )}
            href={link.route}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
