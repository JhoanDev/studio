
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
  console.log('[SEED] Iniciando verificação do banco de dados...');
  try {
    // 1. Check if the 'users' collection is empty
    const usersQuery = query(collection(db, 'users'), limit(1));
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      console.log('[SEED] Banco de dados vazio. Iniciando processo para popular...');

      // 2. Populate users and get their document IDs
      const userDocs = new Map<string, { id: string; nome: string }>();
      
      const userPromises = initialUsers.map(async (userData) => {
        const userRef = await addDoc(collection(db, 'users'), userData);
        userDocs.set(userData.email, { id: userRef.id, nome: userData.nome });
        console.log(`[SEED] Usuário adicionado: ${userData.nome} (ID: ${userRef.id})`);
      });
      
      await Promise.all(userPromises);
      console.log('[SEED] Todos os usuários foram criados com sucesso.');


      // 3. Populate activities, linking them to the users created
      const monitorCarlos = userDocs.get('carlos.p@unimonitor.com');
      const monitorAna = userDocs.get('ana.s@unimonitor.com');
      
      if (monitorCarlos) {
          console.log(`[SEED] Adicionando atividades para o monitor: ${monitorCarlos.nome}`);
          await addDoc(collection(db, 'activities'), { ...initialActivities[0], monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome });
          await addDoc(collection(db, 'activities'), { ...initialActivities[2], monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome });
          await addDoc(collection(db, 'activities'), { ...initialActivities[4], monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome });
      } else {
          console.log('[SEED] WARN: Monitor carlos.p@unimonitor.com não encontrado nos documentos criados.');
      }
      
      if (monitorAna) {
          console.log(`[SEED] Adicionando atividades para a monitora: ${monitorAna.nome}`);
          await addDoc(collection(db, 'activities'), { ...initialActivities[1], monitorId: monitorAna.id, monitorName: monitorAna.nome });
          await addDoc(collection(db, 'activities'), { ...initialActivities[3], monitorId: monitorAna.id, monitorName: monitorAna.nome });
      } else {
          console.log('[SEED] WARN: Monitora ana.s@unimonitor.com não encontrada nos documentos criados.');
      }
      console.log('[SEED] Todas as atividades foram criadas com sucesso.');

      
      // 4. Populate announcements
      if (monitorCarlos) {
        console.log(`[SEED] Adicionando avisos para o monitor: ${monitorCarlos.nome}`);
        await addDoc(collection(db, 'announcements'), { ...initialAnnouncements[1], monitorId: monitorCarlos.id });
      }
       if (monitorAna) {
        console.log(`[SEED] Adicionando avisos para a monitora: ${monitorAna.nome}`);
        await addDoc(collection(db, 'announcements'), { ...initialAnnouncements[0], monitorId: monitorAna.id });
      }
      console.log('[SEED] Todos os avisos foram criados com sucesso.');


      console.log('[SEED] Processo de popular o banco de dados concluído com sucesso!');
    } else {
      console.log('[SEED] O banco de dados já contém dados. A rotina para popular não será executada.');
    }
  } catch (error) {
    console.error("[SEED] Ocorreu um erro crítico durante o processo:", error);
  }
}
