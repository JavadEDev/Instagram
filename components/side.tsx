import { Button } from "@nextui-org/button";
import { PowerIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import SideLinks from "./sideLinks";

import Logo from "@/public/insta.png";
import { signOut } from "@/auth";

export default function Side() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 justify-start rounded-md p-4"
        href="/dashboard"
      >
        <figure className="w-32 md:w-40 pt-4">
          <Image alt="Instagram" src={Logo} />
        </figure>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <SideLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block" />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            type="submit"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
