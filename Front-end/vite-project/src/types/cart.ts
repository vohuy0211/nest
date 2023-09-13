export interface ICart {
  book_id: number;
  oders_id: number;
  quantity: number;
  length: number;
}

export interface IHistory {
  totalPrice?: number;
  orderDate?: string;
  orderId?: number;
  productId?: number;
  quantity?: number;
  status?: number;
  fullName: string;
  phoneNumber: number;
  address: string;
}