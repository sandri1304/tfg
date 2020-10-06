
import { UserClient } from './userclient';

export interface ClientsResponse {
 code: number
 count: number
 clients : Array<UserClient>
}
