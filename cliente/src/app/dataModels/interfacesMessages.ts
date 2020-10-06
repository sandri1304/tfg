export interface MessagesArray {
    items: Messages[];
    total_count: number;
  }
  
  export interface Messages {
    nombreUsuario: string;
    correoUsuario: string;
    mensaje: string;
    leido: boolean;
    fecha:Date;
    _id: Object;
  }