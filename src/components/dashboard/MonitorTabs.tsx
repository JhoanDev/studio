'use client'

import { useState } from 'react';
import type { Activity, Announcement } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PlusCircle, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ActivityForm } from './ActivityForm';
import { useToast } from '@/hooks/use-toast';

interface MonitorTabsProps {
  activities: Activity[];
  announcements: Announcement[];
  modalities: string[];
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  APROVADO: 'default',
  PENDENTE: 'secondary',
  REPROVADO: 'destructive',
};

export function MonitorTabs({ activities: initialActivities, announcements: initialAnnouncements, modalities }: MonitorTabsProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const { toast } = useToast();

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedActivity(null);
    setIsFormOpen(true);
  };

  const handleDelete = (activityId: string) => {
    // In a real app, you'd call an API here.
    setActivities(prev => prev.filter(act => act.id !== activityId));
    toast({
      title: "Atividade Removida!",
      description: "A atividade foi removida com sucesso.",
    });
  };

  const handleFormSubmit = (values: Omit<Activity, 'id' | 'status' | 'monitorId' | 'monitorName'>) => {
    // In a real app, you'd call an API here.
    if (selectedActivity) {
      // Update existing activity
      setActivities(prev => prev.map(act => act.id === selectedActivity.id ? { ...selectedActivity, ...values, status: 'PENDENTE' } : act));
      toast({
        title: "Atividade Atualizada!",
        description: "Sua atividade foi atualizada e enviada para aprovação.",
      });
    } else {
      // Create new activity
      const newActivity: Activity = {
        id: `act${Date.now()}`, // temporary unique ID
        ...values,
        status: 'PENDENTE',
        monitorId: 'monitor1', // This would be the logged-in user's ID
        monitorName: 'Carlos Pereira' // This would be the logged-in user's name
      };
      setActivities(prev => [...prev, newActivity]);
       toast({
        title: "Atividade Cadastrada!",
        description: "Sua atividade foi criada e enviada para aprovação.",
      });
    }
    setIsFormOpen(false);
    setSelectedActivity(null);
  }

  return (
    <>
      <Tabs defaultValue="activities">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activities">Minhas Atividades</TabsTrigger>
          <TabsTrigger value="announcements">Meus Avisos</TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Minhas Atividades</CardTitle>
                <CardDescription>Cadastre e gerencie suas atividades esportivas.</CardDescription>
              </div>
              <Button onClick={handleCreate}>
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  Cadastrar Atividade
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Dia e Hora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length > 0 ? activities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.modalidade}</TableCell>
                      <TableCell>{activity.diaSemana}, {activity.horaInicio}-{activity.horaFim}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[activity.status]}>{activity.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" disabled={activity.status === 'APROVADO'}>
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(activity)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                              </DropdownMenuItem>
                               <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-50">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Remover</span>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Essa ação não pode ser desfeita. Isso irá remover permanentemente a atividade.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(activity.id)} className="bg-destructive hover:bg-destructive/90">Remover</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                            Nenhuma atividade cadastrada.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meus Avisos</CardTitle>
                <CardDescription>Publique e gerencie avisos para suas modalidades.</CardDescription>
              </div>
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  Publicar Aviso
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Data de Publicação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {announcements.map(announcement => (
                      <TableRow key={announcement.id}>
                          <TableCell className="font-medium">{announcement.titulo}</TableCell>
                          <TableCell>
                              <Badge variant="outline">{announcement.modalidade}</Badge>
                          </TableCell>
                          <TableCell>{new Date(announcement.dataPublicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                          <TableCell className="text-right">
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreVertical className="h-4 w-4" />
                                  </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remover
                                  </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          </TableCell>
                      </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       <ActivityForm 
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        activity={selectedActivity}
        modalities={modalities}
      />
    </>
  );
}
