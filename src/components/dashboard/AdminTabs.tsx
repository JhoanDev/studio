'use client';

import { useState } from 'react';
import type { Activity, User, Status } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, X, Trash2, Edit, PlusCircle, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface AdminTabsProps {
  activities: Activity[];
  monitors: User[];
}

export function AdminTabs({ activities: initialActivities, monitors: initialMonitors }: AdminTabsProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [monitors, setMonitors] = useState<User[]>(initialMonitors);
  const { toast } = useToast();

  const handleActivityStatusChange = (activityId: string, status: Status) => {
    setActivities(prev => prev.map(act => act.id === activityId ? { ...act, status } : act));
    toast({
        title: `Atividade ${status === 'APROVADO' ? 'aprovada' : 'reprovada'}!`,
        description: `A atividade foi marcada como ${status.toLowerCase()}.`,
    });
  };

  const pendingActivities = activities.filter(a => a.status === 'PENDENTE');

  return (
    <Tabs defaultValue="activities">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="activities">Aprovar Atividades</TabsTrigger>
        <TabsTrigger value="monitors">Gerenciar Monitores</TabsTrigger>
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
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Monitor</TableHead>
                    <TableHead>Dia e Hora</TableHead>
                    <TableHead className="text-right w-[210px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingActivities.length > 0 ? pendingActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.modalidade}</TableCell>
                      <TableCell>{activity.monitorName}</TableCell>
                      <TableCell>{activity.diaSemana}, {activity.horaInicio}-{activity.horaFim}</TableCell>
                      <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50 hover:text-green-700 border-green-200 hover:border-green-300" onClick={() => handleActivityStatusChange(activity.id, 'APROVADO')}>
                                  <Check className="mr-2 h-4 w-4" /> Aprovar
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300" onClick={() => handleActivityStatusChange(activity.id, 'REPROVADO')}>
                                  <X className="mr-2 h-4 w-4" /> Reprovar
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Monitores</CardTitle>
              <CardDescription>Adicione, edite ou remova monitores do sistema.</CardDescription>
            </div>
            <Button>
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
                        <TableHead>Email</TableHead>
                        <TableHead>Login</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {monitors.map(monitor => (
                        <TableRow key={monitor.id}>
                            <TableCell className="font-medium">{monitor.nome}</TableCell>
                            <TableCell>{monitor.email}</TableCell>
                            <TableCell><Badge variant="secondary">{monitor.login}</Badge></TableCell>
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
