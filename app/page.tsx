import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between rounded-full bg-[#DDE4ED] px-6 shadow-md">
          {/* Left Section - Brand */}
          <div className="flex items-center">
            <span className="text-lg font-semibold text-zinc-700">monomind</span>
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="#use-cases"
              className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
            >
              Use Cases
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
            >
              Pricing
            </Link>
          </div>

          {/* Right Section - Action Button */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignUpButton
                mode="modal"
                signInFallbackRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
              >
                <button className="rounded-full bg-[#007BFF] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0056b3]">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>
    </div>
  );
}
