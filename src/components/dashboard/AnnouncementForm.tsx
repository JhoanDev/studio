
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Announcement } from '@/lib/types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const announcementFormSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter no mínimo 5 caracteres.').max(100, 'O título deve ter no máximo 100 caracteres.'),
  mensagem: z.string().min(10, 'A mensagem deve ter no mínimo 10 caracteres.').max(500, 'A mensagem deve ter no máximo 500 caracteres.'),
  modalidade: z.string().min(1, 'Selecione uma modalidade.'),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

interface AnnouncementFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: AnnouncementFormValues) => void;
  announcement: Announcement | null;
  modalities: string[];
}

export function AnnouncementForm({ isOpen, onOpenChange, onSubmit, announcement, modalities }: AnnouncementFormProps) {
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      titulo: '',
      mensagem: '',
      modalidade: '',
    },
  });

  useEffect(() => {
    if (announcement) {
      form.reset({
        titulo: announcement.titulo,
        mensagem: announcement.mensagem,
        modalidade: announcement.modalidade
      });
    } else {
      form.reset({
        titulo: '',
        mensagem: '',
        modalidade: '',
      });
    }
  }, [announcement, form, isOpen]);

  const title = announcement ? 'Editar Aviso' : 'Publicar Novo Aviso';
  const description = announcement
    ? 'Edite as informações do seu aviso.'
    : 'Preencha os dados para criar um novo aviso para os alunos.';
  const buttonText = announcement ? 'Salvar Alterações' : 'Publicar Aviso';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Aviso</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cancelamento do treino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o aviso em detalhes aqui."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modalidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidade Associada</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modalities.map(mod => (
                        <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
