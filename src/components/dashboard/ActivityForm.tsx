
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
import type { Activity } from '@/lib/types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const activityFormSchema = z.object({
  modalidade: z.string().min(1, 'Selecione uma modalidade.'),
  diaSemana: z.string().min(1, 'O dia da semana é obrigatório.'),
  horaInicio: z.string().regex(timeRegex, 'Formato de hora inválido (HH:MM).'),
  horaFim: z.string().regex(timeRegex, 'Formato de hora inválido (HH:MM).'),
}).refine(data => {
    // Validação para garantir que a hora de fim é maior que a hora de início
    const [startHour, startMinute] = data.horaInicio.split(':').map(Number);
    const [endHour, endMinute] = data.horaFim.split(':').map(Number);
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
        return false;
    }
    return true;
}, {
    message: "A hora de fim deve ser posterior à hora de início.",
    path: ["horaFim"], // Campo onde o erro será exibido
});


export type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface ActivityFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: ActivityFormValues) => void;
  activity: Activity | null;
  modalities: string[];
}

const weekDays = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
]

export function ActivityForm({ isOpen, onOpenChange, onSubmit, activity, modalities }: ActivityFormProps) {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      modalidade: '',
      diaSemana: '',
      horaInicio: '',
      horaFim: '',
    },
  });

  useEffect(() => {
    if (activity) {
      form.reset({
        modalidade: activity.modalidade,
        diaSemana: activity.diaSemana,
        horaInicio: activity.horaInicio,
        horaFim: activity.horaFim
      });
    } else {
      form.reset({
        modalidade: '',
        diaSemana: '',
        horaInicio: '',
        horaFim: '',
      });
    }
  }, [activity, form, isOpen]);

  const title = activity ? 'Editar Atividade' : 'Cadastrar Atividade';
  const description = activity
    ? 'Edite as informações da sua atividade. A atividade será reenviada para aprovação.'
    : 'Preencha os dados para criar uma nova atividade esportiva.';
  const buttonText = activity ? 'Salvar Alterações' : 'Cadastrar Atividade';

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
              name="modalidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidade</FormLabel>
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
            <FormField
              control={form.control}
              name="diaSemana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia da Semana</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia da semana" />
                      </Trigger>
                    </FormControl>
                    <SelectContent>
                      {weekDays.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="horaInicio"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Hora de Início</FormLabel>
                    <FormControl>
                        <Input placeholder="HH:MM" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="horaFim"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Hora de Fim</FormLabel>
                    <FormControl>
                        <Input placeholder="HH:MM" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
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
