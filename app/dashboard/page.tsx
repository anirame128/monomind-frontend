import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Header */}
      <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-xl font-semibold text-black dark:text-white">
            MonoMind Dashboard
          </Link>
          <nav className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            Welcome to your Dashboard
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Hello, {user?.firstName || user?.emailAddresses[0]?.emailAddress || "User"}! This is your protected dashboard.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Overview
              </h3>
              <svg
                className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-3.75v3.75m-9-1.5v1.5m0 0h.375c.621 0 1.125.504 1.125 1.125V18a1.125 1.125 0 01-1.125 1.125h-.375m0 0H6m3 0H9m-3 0v-1.5c0-.621-.504-1.125-1.125-1.125H6"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              View your account statistics and activity summary.
            </p>
            <button className="mt-4 text-sm font-medium text-black transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-zinc-400">
              View Details →
            </button>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Settings
              </h3>
              <svg
                className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your account preferences and configuration.
            </p>
            <button className="mt-4 text-sm font-medium text-black transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-zinc-400">
              Open Settings →
            </button>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Activity
              </h3>
              <svg
                className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Track your recent actions and history.
            </p>
            <button className="mt-4 text-sm font-medium text-black transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-zinc-400">
              View Activity →
            </button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Account Information
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Email
              </p>
              <p className="mt-1 text-base text-black dark:text-white">
                {user?.emailAddresses[0]?.emailAddress || "Not available"}
              </p>
            </div>
            {user?.firstName && (
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Name
                </p>
                <p className="mt-1 text-base text-black dark:text-white">
                  {user.firstName} {user.lastName || ""}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                User ID
              </p>
              <p className="mt-1 font-mono text-sm text-zinc-600 dark:text-zinc-400">
                {userId}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

