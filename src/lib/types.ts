export type Status = 'PENDENTE' | 'APROVADO' | 'REPROVADO';

export interface Activity {
  id: string;
  modalidade: string;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
  status: Status;
  monitorId: string;
  monitorName: string;
}

export interface Announcement {
  id: string;
  titulo: string;
  mensagem: string;
  dataPublicacao: string;
  modalidade: string;
  monitorId: string;
}

// O campo login foi removido pois usaremos o e-mail para autenticação
export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'MONITOR';
  senha?: string; // Adicionado para login inseguro de teste
}
