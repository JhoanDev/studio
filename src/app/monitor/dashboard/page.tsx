
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MonitorTabs } from '@/components/dashboard/MonitorTabs';
import { getActivities, getAnnouncements, findUserByEmail, getModalities } from '@/lib/data';
import type { User, Activity, Announcement } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function MonitorDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [modalities, setModalities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const appUser = await findUserByEmail(firebaseUser.email);
                if (appUser && appUser.role === 'MONITOR') {
                    setUser(appUser);
                    const [allActivities, allAnnouncements, modalitiesData] = await Promise.all([
                        getActivities(),
                        getAnnouncements(),
                        getModalities()
                    ]);

                    setActivities(allActivities.filter(a => a.monitorId === appUser.id));
                    setAnnouncements(allAnnouncements.filter(a => a.monitorId === appUser.id));
                    setModalities(modalitiesData);

                } else {
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
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
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={user} title="Painel do Monitor" />
            <main className="container mx-auto px-4 py-8">
                <MonitorTabs 
                    activities={activities} 
                    announcements={announcements}
                    modalities={modalities}
                    currentUser={user}
                />
            </main>
        </div>
    );
}
