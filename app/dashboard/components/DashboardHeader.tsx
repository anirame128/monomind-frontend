import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function DashboardHeader() {
  return (
    <header className="w-full border-b border-zinc-800 bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="text-xl font-semibold text-white font-mono">
          monomind
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}

