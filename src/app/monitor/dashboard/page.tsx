import { DashboardHeader } from '@/components/DashboardHeader';
import { MonitorTabs } from '@/components/dashboard/MonitorTabs';
import { getActivities, getAnnouncements, getUsers } from '@/lib/data';
import type { User } from '@/lib/types';

// This is a placeholder for a real authentication check.
const getMonitorUser = async (): Promise<User> => {
    const users = await getUsers();
    // For demo, we'll just grab the first monitor. In a real app, this would be the logged-in user.
    const monitor = users.find(u => u.role === 'MONITOR' && u.id === 'monitor1');
    if (!monitor) {
        throw new Error('Monitor user not found');
    }
    return monitor;
}


export default async function MonitorDashboardPage() {
    // In a real app, this would be protected by authentication middleware.
    const user = await getMonitorUser();
    const allActivities = await getActivities();
    const allAnnouncements = await getAnnouncements();

    const myActivities = allActivities.filter(a => a.monitorId === user.id);
    const myAnnouncements = allAnnouncements.filter(a => a.monitorId === user.id);


    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={user} title="Painel do Monitor" />
            <main className="container mx-auto px-4 py-8">
                <MonitorTabs activities={myActivities} announcements={myAnnouncements} />
            </main>
        </div>
    );
}
