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

export interface User {
  id: string;
  nome: string;
  login: string;
  email: string;
  role: 'ADMIN' | 'MONITOR';
}
