
'use server';
// IMPORTANT: This file is used for DEMO purposes only.
// In a real production application, you would use database migrations or a dedicated admin panel for this.
import { collection, getDocs, limit, query, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Activity, Announcement } from './types';

// --- SEED DATA ---

const initialUsers: Omit<User, 'id'>[] = [
    { nome: 'Administrador', email: 'admin@unimonitor.com', role: 'ADMIN' },
    { nome: 'Carlos Pereira', email: 'carlos.p@unimonitor.com', role: 'MONITOR' },
    { nome: 'Ana Souza', email: 'ana.s@unimonitor.com', role: 'MONITOR' },
];

const initialActivities: Omit<Activity, 'id' | 'monitorId' | 'monitorName'>[] = [
    { modalidade: 'Futebol', diaSemana: 'Segunda-feira', horaInicio: '18:00', horaFim: '19:00', status: 'APROVADO' },
    { modalidade: 'Vôlei', diaSemana: 'Terça-feira', horaInicio: '19:00', horaFim: '20:00', status: 'APROVADO' },
    { modalidade: 'Basquete', diaSemana: 'Quarta-feira', horaInicio: '17:30', horaFim: '18:30', status: 'PENDENTE' },
    { modalidade: 'Yoga', diaSemana: 'Sexta-feira', horaInicio: '08:00', horaFim: '09:00', status: 'REPROVADO' },
    { modalidade: 'Natação', diaSemana: 'Sábado', horaInicio: '10:00', horaFim: '11:00', status: 'APROVADO' },
];

const initialAnnouncements: Omit<Announcement, 'id' | 'monitorId'>[] = [
    { titulo: 'Início das Aulas de Natação', mensagem: 'As aulas de natação começarão na próxima semana. Vagas limitadas!', dataPublicacao: new Date().toISOString(), modalidade: 'Natação' },
    { titulo: 'Cancelamento do Treino de Futebol', mensagem: 'O treino de futebol de hoje foi cancelado devido à chuva.', dataPublicacao: new Date().toISOString(), modalidade: 'Futebol' },
];

// --- SEEDING LOGIC ---

export async function seedDatabase() {
  try {
    const usersQuery = query(collection(db, 'users'), limit(1));
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      console.log('Database is empty. Seeding data...');

      const userDocs = new Map<string, { id: string; nome: string }>();
      
      const userPromises = initialUsers.map(async (userData) => {
        const userRef = await addDoc(collection(db, 'users'), userData);
        userDocs.set(userData.email, { id: userRef.id, nome: userData.nome });
      });
      
      await Promise.all(userPromises);
      console.log('All users created.');

      const monitorCarlos = userDocs.get('carlos.p@unimonitor.com');
      const monitorAna = userDocs.get('ana.s@unimonitor.com');
      
      if (monitorCarlos) {
          await addDoc(collection(db, 'activities'), { ...initialActivities[0], monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome });
          await addDoc(collection(db, 'activities'), { ...initialActivities[2], monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome });
          await addDoc(collection(db, 'activities'), { ...initialActivities[4], monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome });
          console.log("Added Carlos's activities.");
      }
      
      if (monitorAna) {
          await addDoc(collection(db, 'activities'), { ...initialActivities[1], monitorId: monitorAna.id, monitorName: monitorAna.nome });
          await addDoc(collection(db, 'activities'), { ...initialActivities[3], monitorId: monitorAna.id, monitorName: monitorAna.nome });
          console.log("Added Ana's activities.");
      }
      
      if (monitorCarlos) {
        await addDoc(collection(db, 'announcements'), { ...initialAnnouncements[1], monitorId: monitorCarlos.id });
        console.log("Added Carlos's announcement.");
      }

       if (monitorAna) {
        await addDoc(collection(db, 'announcements'), { ...initialAnnouncements[0], monitorId: monitorAna.id });
        console.log("Added Ana's announcement.");
      }
      
      console.log('Database seeding complete.');
    }
  } catch (error) {
    console.error("Critical error during seeding:", error);
  }
}
