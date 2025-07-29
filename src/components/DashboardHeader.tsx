import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import type { User } from '@/lib/types';

interface DashboardHeaderProps {
  user: User;
  title: string;
}

export function DashboardHeader({ user, title }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="bg-card border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="font-headline text-xl font-bold text-primary">
            {title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="h-5 w-5" />
              <span>{user.nome}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
