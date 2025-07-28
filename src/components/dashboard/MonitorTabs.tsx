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

interface MonitorTabsProps {
  activities: Activity[];
  announcements: Announcement[];
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  APROVADO: 'default',
  PENDENTE: 'secondary',
  REPROVADO: 'destructive',
};

export function MonitorTabs({ activities: initialActivities, announcements: initialAnnouncements }: MonitorTabsProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  return (
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
            <Button>
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
                {activities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.modalidade}</TableCell>
                    <TableCell>{activity.diaSemana}, {activity.horaInicio}-{activity.horaFim}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[activity.status]}>{activity.status}</Badge>
                    </TableCell>
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
  );
}
