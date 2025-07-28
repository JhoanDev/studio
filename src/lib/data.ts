import type { User, Activity, Announcement } from './types';

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

const modalities = [
    'Futebol', 'Vôlei', 'Basquete', 'Natação', 'Handebol', 'Atletismo', 'Tênis de Mesa', 'Xadrez', 'Yoga'
];

// Simulate async data fetching
export const getUsers = async (): Promise<User[]> => {
  return new Promise(resolve => setTimeout(() => resolve(users), 50));
};

export const getActivities = async (): Promise<Activity[]> => {
  return new Promise(resolve => setTimeout(() => resolve(activities), 50));
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  return new Promise(resolve => setTimeout(() => resolve(announcements), 50));
};

export const getModalities = async (): Promise<string[]> => {
    return new Promise(resolve => setTimeout(() => resolve(modalities), 50));
};

export const findUserByLogin = async (login: string): Promise<User | undefined> => {
    const user = users.find(u => u.login === login);
    return new Promise(resolve => setTimeout(() => resolve(user), 50));
}
