import { Clients } from './clients';

export interface UserClientArray {
  items: UserClient[];
  total_count: number;
}

export class UserClient {
  clients: Clients;
  _id: string;
  correo: string;

}
