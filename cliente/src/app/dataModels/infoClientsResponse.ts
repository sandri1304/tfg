import { Clients } from './clients';

export class infoClientsResponse {
  clients: Clients;
  email: string;
  code: number;
  message: string;
  error: boolean;
}
