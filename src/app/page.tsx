import { ActivityCard } from '@/components/shared/ActivityCard';
import { AnnouncementCard } from '@/components/shared/AnnouncementCard';
import { FilterControls } from '@/components/shared/FilterControls';
import { getActivities, getAnnouncements, getModalities } from '@/lib/actions/data';
import type { Activity, Announcement } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

export default async function Home({ searchParams }: { searchParams?: { modality?: string } }) {
  const allActivities = await getActivities();
  const allAnnouncements = await getAnnouncements();
  const modalities = await getModalities();

  const selectedModality = searchParams?.modality || 'all';

  const approvedActivities = allActivities.filter(
    (activity: Activity) =>
      activity.status === 'APROVADO' &&
      (selectedModality === 'all' || activity.modalidade === selectedModality)
  );

  const announcements = allAnnouncements.filter(
    (announcement: Announcement) =>
      selectedModality === 'all' || announcement.modalidade === selectedModality
  );

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
            UniMonitor Esporte
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seu portal para as atividades esportivas da universidade. Encontre horários, locais e avisos importantes.
          </p>
        </div>

        <FilterControls modalities={modalities} />

        <div className="mt-8">
          <h2 className="font-headline text-3xl font-semibold mb-6 text-primary/90">Cronograma de Atividades</h2>
          {approvedActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {approvedActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <Card className="flex items-center justify-center h-40">
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">Nenhuma atividade encontrada para a modalidade selecionada.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-12 bg-border/50" />

        <div>
          <h2 className="font-headline text-3xl font-semibold mb-6 text-primary/90">Avisos</h2>
          {announcements.length > 0 ? (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <Card className="flex items-center justify-center h-40">
               <CardContent className="p-6">
                <p className="text-muted-foreground text-center">Nenhum aviso encontrado para a modalidade selecionada.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
