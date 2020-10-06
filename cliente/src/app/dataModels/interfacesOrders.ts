import { Users } from './users';
import { products } from './products';

export interface OrdersArray {
  items: Orders[];
  total_count: number;
}

export interface Orders {
  idPedido: string;
  estado: string;
  fechaEntrada: Date;
  fechaEntrega: Date;
  usuarios: Users;
  articulos: products;
  precio: number;
}
