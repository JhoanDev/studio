import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Announcement } from '@/types';
import { Megaphone, Calendar } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex-row gap-4 items-start pb-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
            <Megaphone className="h-6 w-6" />
        </div>
        <div>
            <CardTitle className="font-headline text-xl">{announcement.titulo}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
                <Calendar className="h-4 w-4"/>
                Publicado em: {new Date(announcement.dataPublicacao).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{announcement.mensagem}</p>
      </CardContent>
      <CardFooter>
        <Badge variant="outline">{announcement.modalidade}</Badge>
      </CardFooter>
    </Card>
  );
}
