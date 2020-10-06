export interface ArrayAlbaranes {
    items: Albaranes[];
    total_count: number;
}

export interface Albaranes {
    _id: string,
    nalbaran: string;
    fecha: string;
    cliente: string;
}