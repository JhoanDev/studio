
'use server';
// IMPORTANT: This file is used for DEMO purposes only.
import { collection, getDocs, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { Activity, Announcement, User } from './types';

// --- SEED DATA ---

const initialUsers: Omit<User, 'id'>[] = [
    { nome: 'Administrador', email: 'admin@unimonitor.com', role: 'ADMIN', senha: '123' },
    { nome: 'Carlos Pereira', email: 'carlos.p@unimonitor.com', role: 'MONITOR', senha: '123' },
    { nome: 'Ana Souza', email: 'ana.s@unimonitor.com', role: 'MONITOR', senha: '123' },
];

// --- SEEDING LOGIC ---

async function clearCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`[SEED] Coleção '${collectionName}' já está vazia.`);
        return;
    }
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`[SEED] Coleção '${collectionName}' foi limpa.`);
}


export async function seedDatabase() {
  try {
    console.log('[SEED] Forçando a reinicialização do banco de dados...');
    
    // Limpar coleções existentes
    await clearCollection('activities');
    await clearCollection('announcements');
    await clearCollection('users');

    console.log('[SEED] Populando dados...');
    const usersCollection = collection(db, 'users');
    const batch = writeBatch(db);

    // Criar usuários e guardar seus IDs
    const userRefs: { [email: string]: { id: string, nome: string } } = {};
    for (const userData of initialUsers) {
        const userRef = doc(usersCollection); // Cria uma referência com ID único
        batch.set(userRef, userData);
        userRefs[userData.email] = { id: userRef.id, nome: userData.nome };
    }
    await batch.commit(); // Salva todos os usuários no banco
    console.log('[SEED] Usuários de teste criados no Firestore.');


    // Usar os IDs para criar atividades e avisos
    const monitorCarlos = userRefs['carlos.p@unimonitor.com'];
    const monitorAna = userRefs['ana.s@unimonitor.com'];
    
    const activitiesCol = collection(db, 'activities');
    const announcementsCol = collection(db, 'announcements');

    // Atividades
    await addDoc(activitiesCol, { monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome, modalidade: 'Futebol', diaSemana: 'Segunda-feira', horaInicio: '18:00', horaFim: '19:00', status: 'APROVADO' });
    await addDoc(activitiesCol, { monitorId: monitorAna.id, monitorName: monitorAna.nome, modalidade: 'Vôlei', diaSemana: 'Terça-feira', horaInicio: '19:00', horaFim: '20:00', status: 'APROVADO' });
    await addDoc(activitiesCol, { monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome, modalidade: 'Basquete', diaSemana: 'Quarta-feira', horaInicio: '17:30', horaFim: '18:30', status: 'PENDENTE' });
    await addDoc(activitiesCol, { monitorId: monitorAna.id, monitorName: monitorAna.nome, modalidade: 'Yoga', diaSemana: 'Sexta-feira', horaInicio: '08:00', horaFim: '09:00', status: 'REPROVADO' });
    await addDoc(activitiesCol, { monitorId: monitorCarlos.id, monitorName: monitorCarlos.nome, modalidade: 'Natação', diaSemana: 'Sábado', horaInicio: '10:00', horaFim: '11:00', status: 'APROVADO' });
    console.log('[SEED] Atividades de teste criadas.');

    // Avisos
    await addDoc(announcementsCol, { monitorId: monitorAna.id, titulo: 'Início das Aulas de Natação', mensagem: 'As aulas de natação começarão na próxima semana. Vagas limitadas!', dataPublicacao: new Date().toISOString(), modalidade: 'Natação' });
    await addDoc(announcementsCol, { monitorId: monitorCarlos.id, titulo: 'Cancelamento do Treino de Futebol', mensagem: 'O treino de futebol de hoje foi cancelado devido à chuva.', dataPublicacao: new Date().toISOString(), modalidade: 'Futebol' });
    console.log('[SEED] Avisos de teste criados.');
    
    console.log('[SEED] Processo de popular o banco de dados concluído.');
    
  } catch (error) {
    console.error("[SEED] Erro crítico durante o processo:", error);
  }
}
