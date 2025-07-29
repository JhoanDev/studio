import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Activity, Announcement } from './types';

// The mock data is now commented out as we transition to Firestore.
/*
const users: User[] = [
  { id: 'admin1', nome: 'Admin Geral', login: 'admin', email: 'admin@unisport.com', role: 'ADMIN' },
  { id: 'monitor1', nome: 'Carlos Pereira', login: 'carlos', email: 'carlos@unisport.com', role: 'MONITOR' },
  { id: 'monitor2', nome: 'Ana Souza', login: 'ana', email: 'ana@unisport.com', role: 'MONITOR' },
];

const activities: Activity[] = [
  { id: 'act1', modalidade: 'Futebol', diaSemana: 'Segunda-feira', horaInicio: '18:00', horaFim: '20:00', status: 'APROVADO', monitorId: 'monitor1', monitorName: 'Carlos Pereira' },
  { id: 'act2', modalidade: 'Vôlei', diaSemana: 'Terça-feira', horaInicio: '19:00', horaFim: '21:00', status: 'APROVADO', monitorId: 'monitor2', monitorName: 'Ana Souza' },
  { id: 'act3', modalidade: 'Basquete', diaSemana: 'Quarta-feira', horaInicio: '17:00', horaFim: '19:00', status: 'PENDENTE', monitorId: 'monitor1', monitorName: 'Carlos Pereira' },
  { id: 'act4', modalidade: 'Natação', diaSemana: 'Sexta-feira', horaInicio: '08:00', horaFim: '09:00', status: 'APROVADO', monitorId: 'monitor2', monitorName: 'Ana Souza' },
  { id: 'act5', modalidade: 'Futebol', diaSemana: 'Quinta-feira', horaInicio: '18:00', horaFim: '20:00', status: 'REPROVADO', monitorId: 'monitor1', monitorName: 'Carlos Pereira' },
  { id: 'act6', modalidade: 'Yoga', diaSemana: 'Terça-feira', horaInicio: '09:00', horaFim: '10:00', status: 'PENDENTE', monitorId: 'monitor2', monitorName: 'Ana Souza' },
];

const announcements: Announcement[] = [
  { id: 'ann1', titulo: 'Cancelamento Treino de Vôlei', mensagem: 'O treino de vôlei de hoje (terça-feira) está cancelado devido à chuva.', dataPublicacao: '2024-07-29', modalidade: 'Vôlei', monitorId: 'monitor2' },
  { id: 'ann2', titulo: 'Inscrições Abertas para Torneio', mensagem: 'As inscrições para o torneio de futebol interclasses estão abertas! Procure o monitor Carlos.', dataPublicacao: '2024-07-28', modalidade: 'Futebol', monitorId: 'monitor1' },
  { id: 'ann3', titulo: 'Piscina em Manutenção', mensagem: 'A piscina estará em manutenção na próxima semana. Os treinos de natação estão suspensos até novo aviso.', dataPublicacao: '2024-07-30', modalidade: 'Natação', monitorId: 'monitor2' },
];
*/
const modalities = [
    'Futebol', 'Vôlei', 'Basquete', 'Natação', 'Handebol', 'Atletismo', 'Tênis de Mesa', 'Xadrez', 'Yoga'
];


export const getUsers = async (): Promise<User[]> => {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  return userList;
};

export const getActivities = async (): Promise<Activity[]> => {
  const activitiesCol = collection(db, 'activities');
  const activitySnapshot = await getDocs(activitiesCol);
  const activityList = activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  return activityList;
};

// TODO: Replace with real Firestore implementation
export const getAnnouncements = async (): Promise<Announcement[]> => {
  // Simulating empty for now
  return new Promise(resolve => setTimeout(() => resolve([]), 50));
};

export const getModalities = async (): Promise<string[]> => {
    return new Promise(resolve => setTimeout(() => resolve(modalities), 50));
};

// TODO: Replace with Firebase Auth
export const findUserByLogin = async (login: string): Promise<User | undefined> => {
    const q = query(collection(db, "users"), where("login", "==", login));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return undefined;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}
