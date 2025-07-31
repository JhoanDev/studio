'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { findUserByEmail } from '@/lib/actions/data';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

// Mock de autenticação inseguro para fins de teste
async function signInUnsafe(values: z.infer<typeof formSchema>) {
    const appUser = await findUserByEmail(values.email);

    if (!appUser || appUser.senha !== values.password) {
        throw new Error("Credenciais inválidas");
    }
    return appUser;
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Usar a função de login "insegura"
      const appUser = await signInUnsafe(values);

      toast({
        title: 'Login bem-sucedido!',
        description: `Bem-vindo(a), ${appUser.nome}.`,
      });
      
      // Armazenar dados do usuário no sessionStorage para persistir entre as páginas
      sessionStorage.setItem('user', JSON.stringify(appUser));
      
      // Redirecionar com base na role
      if (appUser.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/monitor/dashboard');
      }

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Erro de login',
            description: 'E-mail ou senha inválidos.',
        });
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>
      </form>
    </Form>
  );
}
