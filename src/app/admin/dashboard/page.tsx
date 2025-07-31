
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { AdminTabs } from '@/components/dashboard/AdminTabs';
import { getActivities, getUsers } from '@/lib/actions/data';
import type { User, Activity } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function AdminDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [monitors, setMonitors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const appUser: User = JSON.parse(storedUser);
        if (appUser && appUser.role === 'ADMIN') {
          setUser(appUser);
          Promise.all([
              getActivities(),
              getUsers(),
          ]).then(([activitiesData, allUsers]) => {
              setActivities(activitiesData);
              setMonitors(allUsers.filter(u => u.role === 'MONITOR'));
              setLoading(false);
          });
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    }, [router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background">
                 <header className="bg-card border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </header>
                <main className="container mx-auto px-4 py-8">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </main>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={user} title="Painel do Administrador" />
            <main className="container mx-auto px-4 py-8">
                <AdminTabs activities={activities} monitors={monitors} />
            </main>
        </div>
    );
}
