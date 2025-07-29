import { DashboardHeader } from '@/components/DashboardHeader';
import { AdminTabs } from '@/components/dashboard/AdminTabs';
import { getActivities, getUsers } from '@/lib/data';
import type { User } from '@/lib/types';

// This is a placeholder for a real authentication check.
const getAdminUser = async (): Promise<User> => {
    const users = await getUsers();
    const admin = users.find(u => u.role === 'ADMIN');
    if (!admin) {
        // Em um app real, o middleware já teria bloqueado o acesso.
        // Isso é um fallback caso o admin não exista no DB.
        return { id: 'admin-fallback', nome: 'Admin', email: 'admin@unimonitor.com', role: 'ADMIN' };
    }
    return admin;
}


export default async function AdminDashboardPage() {
    // In a real app, this would be protected by authentication middleware.
    const user = await getAdminUser();
    const activities = await getActivities();
    const monitors = (await getUsers()).filter(u => u.role === 'MONITOR');

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={user} title="Painel do Administrador" />
            <main className="container mx-auto px-4 py-8">
                <AdminTabs activities={activities} monitors={monitors} />
            </main>
        </div>
    );
}
