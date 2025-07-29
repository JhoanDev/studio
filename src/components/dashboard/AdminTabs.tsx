
'use client';

import { useState } from 'react';
import type { Activity, User, Status } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, X, Trash2, Edit, PlusCircle, MoreVertical, Users, ListChecks, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateActivityStatus } from '@/lib/data';


interface AdminTabsProps {
  activities: Activity[];
  monitors: User[];
}

export function AdminTabs({ activities: initialActivities, monitors: initialMonitors }: AdminTabsProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [monitors, setMonitors] = useState<User[]>(initialMonitors);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const handleActivityStatusChange = async (activityId: string, status: Status) => {
    setIsLoading(prev => ({ ...prev, [activityId]: true }));
    try {
        await updateActivityStatus(activityId, status);
        setActivities(prev => prev.map(act => act.id === activityId ? { ...act, status } : act).filter(act => act.id !== activityId));
        toast({
            title: `Atividade ${status === 'APROVADO' ? 'aprovada' : 'reprovada'}!`,
            description: `A atividade foi marcada como ${status.toLowerCase()}.`,
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Erro!',
            description: 'Não foi possível atualizar o status da atividade.',
        });
    } finally {
        setIsLoading(prev => ({ ...prev, [activityId]: false }));
    }
  };

  const pendingActivities = activities.filter(a => a.status === 'PENDENTE');

  return (
    <Tabs defaultValue="activities">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
        <TabsTrigger value="activities"><ListChecks className="mr-2"/> Aprovar Atividades</TabsTrigger>
        <TabsTrigger value="monitors"><Users className="mr-2"/> Gerenciar Monitores</TabsTrigger>
      </TabsList>

      <TabsContent value="activities">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Pendentes</CardTitle>
            <CardDescription>Aprove ou reprove as atividades submetidas pelos monitores.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atividade</TableHead>
                    <TableHead className="hidden md:table-cell">Monitor</TableHead>
                    <TableHead className="hidden lg:table-cell">Dia e Hora</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingActivities.length > 0 ? pendingActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="font-medium">{activity.modalidade}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {activity.monitorName}
                        </div>
                        <div className="text-sm text-muted-foreground lg:hidden">
                          {activity.diaSemana}, {activity.horaInicio}-{activity.horaFim}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{activity.monitorName}</TableCell>
                      <TableCell className="hidden lg:table-cell">{activity.diaSemana}, {activity.horaInicio}-{activity.horaFim}</TableCell>
                      <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 hover:bg-green-50 hover:text-green-700 border-green-200 hover:border-green-300" 
                                onClick={() => handleActivityStatusChange(activity.id, 'APROVADO')}
                                disabled={isLoading[activity.id]}
                              >
                                  {isLoading[activity.id] ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4 md:mr-2" />} 
                                  <span className="hidden md:inline">Aprovar</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300" 
                                onClick={() => handleActivityStatusChange(activity.id, 'REPROVADO')}
                                disabled={isLoading[activity.id]}
                              >
                                  {isLoading[activity.id] ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4 md:mr-2" />}
                                  <span className="hidden md:inline">Reprovar</span>
                              </Button>
                          </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                      <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                              Nenhuma atividade pendente.
                          </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitors">
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Monitores</CardTitle>
              <CardDescription>Adicione, edite ou remova monitores do sistema.</CardDescription>
            </div>
            <Button className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Adicionar Monitor
            </Button>
          </CardHeader>
          <CardContent>
             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {monitors.map(monitor => (
                        <TableRow key={monitor.id}>
                            <TableCell>
                                <div className="font-medium">{monitor.nome}</div>
                                <div className="text-sm text-muted-foreground md:hidden">{monitor.email}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{monitor.email}</TableCell>
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
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
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
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
