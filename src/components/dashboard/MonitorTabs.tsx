
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Activity, Announcement, User } from '@/lib/types';
import { addActivity, updateActivity, deleteActivity, addAnnouncement, updateAnnouncement, deleteAnnouncement, findUserByEmail } from '@/lib/data';
import { auth } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PlusCircle, Edit, Trash2, MoreVertical, Megaphone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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
import type { ActivityFormValues } from './ActivityForm';
import { AnnouncementForm } from './AnnouncementForm';
import type { AnnouncementFormValues } from './AnnouncementForm';
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
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [isAnnouncementFormOpen, setIsAnnouncementFormOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const { toast } = useToast();

  const refreshData = () => {
    router.refresh();
  }

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsActivityFormOpen(true);
  };

  const handleCreateActivity = () => {
    setSelectedActivity(null);
    setIsActivityFormOpen(true);
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
        await deleteActivity(activityId);
        toast({
          title: "Atividade Removida!",
          description: "A atividade foi removida com sucesso.",
        });
        refreshData();
    } catch(e) {
        toast({
            variant: "destructive",
            title: "Erro ao remover atividade",
            description: "Não foi possível remover a atividade. Tente novamente.",
        });
    }
  };

  const handleActivityFormSubmit = async (values: ActivityFormValues) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Você precisa estar logado.'});
        return;
    }
    
    try {
        const appUser = await findUserByEmail(firebaseUser.email);
        if (!appUser) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não encontrado no banco de dados.'});
            return;
        }

        if (selectedActivity) {
            const updatedData = { ...values, status: 'PENDENTE' as const };
            await updateActivity(selectedActivity.id, updatedData);
            toast({
                title: "Atividade Atualizada!",
                description: "Sua atividade foi atualizada e reenviada para aprovação.",
            });
        } else {
            const newActivity: Omit<Activity, 'id'> = {
                ...values,
                status: 'PENDENTE',
                monitorId: appUser.id, 
                monitorName: appUser.nome,
            };
            await addActivity(newActivity);
            toast({
                title: "Atividade Cadastrada!",
                description: "Sua atividade foi criada e enviada para aprovação.",
            });
        }
        setIsActivityFormOpen(false);
        setSelectedActivity(null);
        refreshData();
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "Não foi possível salvar a atividade. Tente novamente.",
        });
    }
  }

  // Handlers for Announcements
    const handleCreateAnnouncement = () => {
        setSelectedAnnouncement(null);
        setIsAnnouncementFormOpen(true);
    };

    const handleEditAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsAnnouncementFormOpen(true);
    };

    const handleAnnouncementFormSubmit = async (values: AnnouncementFormValues) => {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Você precisa estar logado.'});
            return;
        }

        try {
            const appUser = await findUserByEmail(firebaseUser.email);
            if (!appUser) {
                toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não encontrado no banco de dados.'});
                return;
            }

            if (selectedAnnouncement) {
                await updateAnnouncement(selectedAnnouncement.id, values);
                toast({ title: 'Aviso atualizado com sucesso!' });
            } else {
                const newAnnouncement: Omit<Announcement, 'id'> = {
                    ...values,
                    dataPublicacao: new Date().toISOString(),
                    monitorId: appUser.id,
                };
                await addAnnouncement(newAnnouncement);
                toast({ title: 'Aviso publicado com sucesso!' });
            }
            setIsAnnouncementFormOpen(false);
            refreshData();
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erro ao publicar",
                description: "Não foi possível publicar o aviso. Tente novamente.",
            });
        }
    };

    const handleDeleteAnnouncement = async (id: string) => {
        try {
            await deleteAnnouncement(id);
            toast({ title: 'Aviso removido!' });
            refreshData();
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erro ao remover",
                description: "Não foi possível remover o aviso. Tente novamente.",
            });
        }
    };


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
              <Button onClick={handleCreateActivity}>
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  Cadastrar Atividade
              </Button>
            </CardHeader>
            <CardContent>
             <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Dia e Hora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[100px]">Ações</TableHead>
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
                        <AlertDialog>
                          <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Abrir menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditActivity(activity)} disabled={activity.status === 'APROVADO'}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <button className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-50 w-full disabled:text-muted-foreground disabled:hover:bg-transparent">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Remover</span>
                                        </button>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso irá remover permanentemente a atividade dos nossos servidores.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteActivity(activity.id)} className="bg-destructive hover:bg-destructive/90">Sim, remover</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
              </div>
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
              <Button onClick={handleCreateAnnouncement}>
                  <Megaphone className="mr-2 h-4 w-4"/>
                  Publicar Aviso
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Modalidade</TableHead>
                        <TableHead>Data de Publicação</TableHead>
                        <TableHead className="text-right w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length > 0 ? announcements.map(announcement => (
                        <TableRow key={announcement.id}>
                            <TableCell className="font-medium">{announcement.titulo}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{announcement.modalidade}</Badge>
                            </TableCell>
                            <TableCell>{new Date(announcement.dataPublicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                            <TableCell className="text-right">
                                <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                            <AlertDialogTrigger asChild>
                                                <button className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-50 w-full disabled:text-muted-foreground disabled:hover:bg-transparent">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Remover
                                                </button>
                                            </AlertDialogTrigger>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Essa ação não pode ser desfeita. Isso irá remover permanentemente o aviso.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteAnnouncement(announcement.id)} className="bg-destructive hover:bg-destructive/90">Sim, remover</AlertDialogAction>
                                        </Footer>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                    Nenhum aviso publicado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       <ActivityForm 
        isOpen={isActivityFormOpen}
        onOpenChange={setIsActivityFormOpen}
        onSubmit={handleActivityFormSubmit}
        activity={selectedActivity}
        modalities={modalities}
      />
      <AnnouncementForm
        isOpen={isAnnouncementFormOpen}
        onOpenChange={setIsAnnouncementFormOpen}
        onSubmit={handleAnnouncementFormSubmit}
        announcement={selectedAnnouncement}
        modalities={modalities}
      />
    </>
  );
}
