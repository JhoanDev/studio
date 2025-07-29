
'use server';
// IMPORTANT: This file is used for DEMO purposes only.
// In a real production application, you would use database migrations or a dedicated admin panel for this.
import { collection, getDocs, limit, query, addDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Activity, Announcement, User } from './types';

// --- SEED DATA ---

const initialActivitiesData: (Omit<Activity, 'id' | 'monitorId' | 'monitorName' | 'monitorEmail'> & { monitorEmail: string })[] = [
    { monitorEmail: 'carlos.p@unimonitor.com', modalidade: 'Futebol', diaSemana: 'Segunda-feira', horaInicio: '18:00', horaFim: '19:00', status: 'APROVADO' },
    { monitorEmail: 'ana.s@unimonitor.com', modalidade: 'Vôlei', diaSemana: 'Terça-feira', horaInicio: '19:00', horaFim: '20:00', status: 'APROVADO' },
    { monitorEmail: 'carlos.p@unimonitor.com', modalidade: 'Basquete', diaSemana: 'Quarta-feira', horaInicio: '17:30', horaFim: '18:30', status: 'PENDENTE' },
    { monitorEmail: 'ana.s@unimonitor.com', modalidade: 'Yoga', diaSemana: 'Sexta-feira', horaInicio: '08:00', horaFim: '09:00', status: 'REPROVADO' },
    { monitorEmail: 'carlos.p@unimonitor.com', modalidade: 'Natação', diaSemana: 'Sábado', horaInicio: '10:00', horaFim: '11:00', status: 'APROVADO' },
];

const initialAnnouncementsData: (Omit<Announcement, 'id' | 'monitorId'> & { monitorEmail: string })[] = [
    { monitorEmail: 'ana.s@unimonitor.com', titulo: 'Início das Aulas de Natação', mensagem: 'As aulas de natação começarão na próxima semana. Vagas limitadas!', dataPublicacao: new Date().toISOString(), modalidade: 'Natação' },
    { monitorEmail: 'carlos.p@unimonitor.com', titulo: 'Cancelamento do Treino de Futebol', mensagem: 'O treino de futebol de hoje foi cancelado devido à chuva.', dataPublicacao: new Date().toISOString(), modalidade: 'Futebol' },
];


async function findUserByEmailForSeed(email: string): Promise<User | null> {
    const q = query(collection(db, "users"), where("email", "==", email), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
}

// --- SEEDING LOGIC ---

export async function seedDatabase() {
  try {
    const activitiesQuery = query(collection(db, 'activities'), limit(1));
    const activitiesSnapshot = await getDocs(activitiesQuery);

    if (activitiesSnapshot.empty) {
      console.log('[SEED] A coleção de atividades está vazia. Populando dados...');

      // Popular Atividades
      for (const activityData of initialActivitiesData) {
          const monitor = await findUserByEmailForSeed(activityData.monitorEmail);
          if (monitor) {
              const newActivity: Omit<Activity, 'id'> = {
                  modalidade: activityData.modalidade,
                  diaSemana: activityData.diaSemana,
                  horaInicio: activityData.horaInicio,
                  horaFim: activityData.horaFim,
                  status: activityData.status,
                  monitorId: monitor.id,
                  monitorName: monitor.nome,
              };
              await addDoc(collection(db, 'activities'), newActivity);
              console.log(`[SEED] Atividade de ${activityData.modalidade} adicionada para ${monitor.nome}.`);
          } else {
              console.warn(`[SEED] Monitor com email ${activityData.monitorEmail} não encontrado. Atividade não adicionada.`);
          }
      }

      // Popular Avisos
       for (const announcementData of initialAnnouncementsData) {
          const monitor = await findUserByEmailForSeed(announcementData.monitorEmail);
           if (monitor) {
              const newAnnouncement: Omit<Announcement, 'id'> = {
                  titulo: announcementData.titulo,
                  mensagem: announcementData.mensagem,
                  dataPublicacao: announcementData.dataPublicacao,
                  modalidade: announcementData.modalidade,
                  monitorId: monitor.id,
              };
              await addDoc(collection(db, 'announcements'), newAnnouncement);
              console.log(`[SEED] Aviso sobre ${announcementData.modalidade} adicionado por ${monitor.nome}.`);
          } else {
              console.warn(`[SEED] Monitor com email ${announcementData.monitorEmail} não encontrado. Aviso não adicionado.`);
          }
       }
      
      console.log('[SEED] Processo de popular o banco de dados concluído.');
    }
  } catch (error) {
    console.error("[SEED] Erro crítico durante o processo:", error);
  }
}
