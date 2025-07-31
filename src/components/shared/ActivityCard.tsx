import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Activity } from '@/types';
import { Calendar, Clock, User } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
}

const statusVariantMap = {
  APROVADO: 'default',
  PENDENTE: 'secondary',
  REPROVADO: 'destructive',
};

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">{activity.modalidade}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{activity.diaSemana}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{activity.horaInicio} - {activity.horaFim}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{activity.monitorName}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Badge variant={statusVariantMap[activity.status] as any}>{activity.status}</Badge>
      </CardFooter>
    </Card>
  );
}
