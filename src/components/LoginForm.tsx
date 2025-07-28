'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { findUserByLogin } from '@/lib/data';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  login: z.string().min(1, { message: 'O login é obrigatório.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // In a real app, you'd call an API. Here we use mock data.
    const user = await findUserByLogin(values.login);
    
    // Simulate password check & network delay
    setTimeout(() => {
      if (user) { // Assuming any password is correct for the demo
        toast({
          title: 'Login bem-sucedido!',
          description: `Bem-vindo(a), ${user.nome}.`,
        });
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/monitor/dashboard');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro de login',
          description: 'Usuário ou senha inválidos.',
        });
        setIsLoading(false);
      }
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <FormControl>
                <Input placeholder="seu.usuario" {...field} />
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
