export interface ProductsArray {
  items: Products[],
  total_count: number,
}

export interface Products {
  _id: string,
  codigoArticulo: string,
  categoria: string,
  marca: string,
  modelo: string,
  pvpTarifa: string,
  pvp: number,
  estado: boolean,
  stock: number,
  fechaModificacion: string,
  fechaPublicacion: string,
  autor: string,
  caracteristicas: string,
  otros: string,
  oferta: string,
  imagen: string,
  envioGratuito: boolean,
  estrellas: number,
  usuarios: number,
  comentarios: string
}
