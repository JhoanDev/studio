import { LoginForm } from '@/components/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import { seedDatabase } from '@/lib/seed';

export default async function LoginPage() {
  // Para fins de teste, esta função irá popular o banco com atividades e avisos se estiver vazio.
  // Em um app real, isso seria removido.
  await seedDatabase();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl hover:shadow-2xl transition-shadow">
        <CardHeader className="text-center">
          <Logo className="w-12 h-12 mx-auto text-primary" />
          <CardTitle className="font-headline text-2xl mt-4">Bem-vindo de volta!</CardTitle>
          <CardDescription>Faça login para gerenciar atividades e avisos.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
