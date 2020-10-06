
export interface OffersArray {
  items: Offers[];
  total_count: number;
}

export interface Offers {
  idOferta: string;
  descuento: string;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion: string;
}
