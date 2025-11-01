'use client'

import { Suspense } from 'react';
import { useUser } from "@clerk/nextjs";
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardContent } from './components/DashboardContent';
import { useApiKeys } from './hooks/useApiKeys';

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-lg text-white font-mono">Loading...</div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { loading: apiKeysLoading } = useApiKeys(user?.id);

  if (!isLoaded || apiKeysLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <DashboardHeader />
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
