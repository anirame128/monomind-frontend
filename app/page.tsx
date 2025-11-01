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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100">
      {/* Sky Background with Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Cloud 1 */}
        <div className="absolute top-20 right-10 w-96 h-32 bg-white/30 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute top-24 right-16 w-80 h-24 bg-white/20 rounded-full blur-xl opacity-50"></div>
        
        {/* Large Cloud 2 */}
        <div className="absolute bottom-40 left-10 w-[500px] h-40 bg-white/25 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-44 left-16 w-96 h-32 bg-white/20 rounded-full blur-2xl opacity-40"></div>
        
        {/* Medium Cloud */}
        <div className="absolute top-1/3 left-1/4 w-64 h-28 bg-white/20 rounded-full blur-2xl opacity-40"></div>
        
        {/* Small Cloud */}
        <div className="absolute bottom-32 right-1/4 w-48 h-20 bg-white/25 rounded-full blur-xl opacity-45"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col font-sans">
        {/* Navigation Bar */}
        <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex h-16 items-center justify-between rounded-full bg-white/20 backdrop-blur-md px-6 shadow-lg border border-white/30">
            {/* Left Section - Brand */}
            <div className="flex items-center">
              <span className="text-lg font-semibold text-white font-sans lowercase">monomind</span>
            </div>

            {/* Middle Section - Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#use-cases"
                className="text-sm font-medium text-white/90 transition-colors hover:text-white font-sans lowercase"
              >
                use cases
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium text-white/90 transition-colors hover:text-white font-sans lowercase"
              >
                features
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-white/90 transition-colors hover:text-white font-sans lowercase"
              >
                pricing
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
                  <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 font-sans lowercase">
                    get started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium text-white mb-6 tracking-tight font-garamond lowercase">
            your extension of context
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl mb-10 leading-relaxed font-sans lowercase">
            monomind turns your ideas into intelligent context that knows what's next—handle real work across your tools and apps in seconds.
          </p>
        </main>

      </div>
    </div>
  );
}
