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
    // 1. Check if the 'users' collection is empty
    const usersQuery = query(collection(db, 'users'), limit(1));
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      console.log('Database is empty. Seeding data...');

      // 2. Populate users and get their document IDs
      const userDocs = new Map<string, string>(); // Map email to doc ID
      for (const userData of initialUsers) {
        const userRef = await addDoc(collection(db, 'users'), userData);
        userDocs.set(userData.email, userRef.id);
        console.log(`Added user: ${userData.nome}`);
      }

      // 3. Populate activities, linking them to the users created
      const monitorCarlosId = userDocs.get('carlos.p@unimonitor.com');
      const monitorAnaId = userDocs.get('ana.s@unimonitor.com');
      
      if (monitorCarlosId) {
          await addDoc(collection(db, 'activities'), { ...initialActivities[0], monitorId: monitorCarlosId, monitorName: 'Carlos Pereira' });
          await addDoc(collection(db, 'activities'), { ...initialActivities[2], monitorId: monitorCarlosId, monitorName: 'Carlos Pereira' });
          await addDoc(collection(db, 'activities'), { ...initialActivities[4], monitorId: monitorCarlosId, monitorName: 'Carlos Pereira' });
          console.log('Added Carlos\'s activities.');
      }
      if (monitorAnaId) {
          await addDoc(collection(db, 'activities'), { ...initialActivities[1], monitorId: monitorAnaId, monitorName: 'Ana Souza' });
          await addDoc(collection(db, 'activities'), { ...initialActivities[3], monitorId: monitorAnaId, monitorName: 'Ana Souza' });
          console.log('Added Ana\'s activities.');
      }
      
      // 4. Populate announcements
      if (monitorCarlosId) {
        await addDoc(collection(db, 'announcements'), { ...initialAnnouncements[1], monitorId: monitorCarlosId });
        console.log('Added Carlos\'s announcement.');
      }
      if (monitorAnaId) {
        await addDoc(collection(db, 'announcements'), { ...initialAnnouncements[0], monitorId: monitorAnaId });
        console.log('Added Ana\'s announcement.');
      }

      console.log('Database seeding complete.');
    } else {
      console.log('Database already has data. Skipping seed.');
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    // In a real app, you might want more robust error handling
  }
}
