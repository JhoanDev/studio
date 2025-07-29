

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Activity, Announcement, User } from '@/lib/types';
import { addActivity, updateActivity, deleteActivity, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/data';
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
  currentUser: User;
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  APROVADO: 'default',
  PENDENTE: 'secondary',
  REPROVADO: 'destructive',
};

export function MonitorTabs({ activities, announcements, modalities, currentUser }: MonitorTabsProps) {
  const router = useRouter();
  
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isActivitySubmitting, setIsActivitySubmitting] = useState(false);

  const [isAnnouncementFormOpen, setIsAnnouncementFormOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isAnnouncementSubmitting, setIsAnnouncementSubmitting] = useState(false);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'activity' | 'announcement', id: string} | null>(null);


  const { toast } = useToast();

  const refreshData = () => {
    router.refresh();
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsActivityFormOpen(true);
  };

  const handleCreateActivity = () => {
    setSelectedActivity(null);
    setIsActivityFormOpen(true);
  };
  
  const confirmDelete = (type: 'activity' | 'announcement', id: string) => {
    setItemToDelete({ type, id });
    setIsAlertDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
        if (itemToDelete.type === 'activity') {
            await deleteActivity(itemToDelete.id);
            toast({
              title: "Atividade Removida!",
              description: "A atividade foi removida com sucesso.",
            });
        } else {
            await deleteAnnouncement(itemToDelete.id);
            toast({ title: 'Aviso removido!' });
        }
        refreshData();
    } catch(e) {
        toast({
            variant: "destructive",
            title: `Erro ao remover ${itemToDelete.type === 'activity' ? 'atividade' : 'aviso'}`,
            description: `Não foi possível remover. Tente novamente.`,
        });
    } finally {
        setIsAlertDialogOpen(false);
        setItemToDelete(null);
    }
  };


  const handleActivityFormSubmit = async (values: ActivityFormValues) => {
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não encontrado.'});
        return;
    }
    
    setIsActivitySubmitting(true);
    
    try {
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
                monitorId: currentUser.id, 
                monitorName: currentUser.nome,
            };
            await addActivity(newActivity);
            toast({
                title: "Atividade Cadastrada!",
                description: "Sua atividade foi criada e enviada para aprovação.",
            });
        }
        setIsActivityFormOpen(false);
        refreshData();
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "Não foi possível salvar a atividade. Tente novamente.",
        });
    } finally {
      setIsActivitySubmitting(false);
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
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não encontrado.'});
            return;
        }

        setIsAnnouncementSubmitting(true);

        try {
            if (selectedAnnouncement) {
                await updateAnnouncement(selectedAnnouncement.id, values);
                toast({ title: 'Aviso atualizado com sucesso!' });
            } else {
                const newAnnouncement: Omit<Announcement, 'id'> = {
                    ...values,
                    dataPublicacao: new Date().toISOString(),
                    monitorId: currentUser.id,
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
        } finally {
          setIsAnnouncementSubmitting(false);
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
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                    <TableHead className="hidden md:table-cell">Dia e Hora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length > 0 ? activities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.modalidade}</TableCell>
                      <TableCell className="hidden md:table-cell">{activity.diaSemana}, {activity.horaInicio}-{activity.horaFim}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[activity.status]}>{activity.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
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
                                    <DropdownMenuItem onSelect={() => confirmDelete('activity', activity.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Remover</span>
                                    </DropdownMenuItem>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                        <TableHead className="hidden md:table-cell">Modalidade</TableHead>
                        <TableHead className="hidden lg:table-cell">Publicação</TableHead>
                        <TableHead className="text-right w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length > 0 ? announcements.map(announcement => (
                        <TableRow key={announcement.id}>
                            <TableCell className="font-medium">{announcement.titulo}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge variant="outline">{announcement.modalidade}</Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{new Date(announcement.dataPublicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                            <TableCell className="text-right">
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
                                         <DropdownMenuItem onSelect={() => confirmDelete('announcement', announcement.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remover
                                        </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
        isSubmitting={isActivitySubmitting}
      />
      <AnnouncementForm
        isOpen={isAnnouncementFormOpen}
        onOpenChange={setIsAnnouncementFormOpen}
        onSubmit={handleAnnouncementFormSubmit}
        announcement={selectedAnnouncement}
        modalities={modalities}
        isSubmitting={isAnnouncementSubmitting}
      />
       <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso irá remover permanentemente o item dos nossos servidores.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Sim, remover</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
