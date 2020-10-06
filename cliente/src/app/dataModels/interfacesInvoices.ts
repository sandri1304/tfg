export interface ArrayInvoices {
  items: Invoices[];
  total_count: number;
}

export interface Invoices {
  _id: string,
  nFactura: string;
  fecha: string;
  cliente: string;
}
