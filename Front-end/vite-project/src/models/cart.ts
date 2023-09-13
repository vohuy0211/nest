import axiosClient from '../api/axiosClient';

export class CartAPI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async addToCart(data: any): Promise<any> {
    const url = "api/v1/orderItem/postOrderItem";
    return axiosClient.post(url, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async addOder(data: any) {
    const url: string = "api/v1/order/postOrder";
    return axiosClient.post(url, data);
  }
  static async getOder(id: number) {
    const url: string = `api/v1/order/${id}`;
    return axiosClient.get(url);
  }
  static async getToCart(id: number) {
    const url = `api/v1/orderItem/${id}`;
    return axiosClient.get(url);
  }
  static async updateCart(id: number, newQuantity: number) {
    const url = `api/v1/orderItem/${id}`;
    return axiosClient.patch(url, { quantityOrder: newQuantity });
  }
  static async deleteCart(id: number) {
    const url = `api/v1/orderItem/ById/${id}`;
    return axiosClient.delete(url);
  }
  static async searchBook(searchTerm: string) {
    const url = `api/v1/product/search/${searchTerm}`;
    return axiosClient.get(url);
  }
  static async postHistory(data: string) {
    const url = "api/v1/history/postHistory";
    return axiosClient.post(url, data);
  }
  static async DelOderItem(id: number) {
    const url = `api/v1/orderItem/${id}`;
    return axiosClient.delete(url);
  }
  static async getHistory(id: number) {
    const url = `api/v1/history/getHistoryByUserId/${id}`;
    // console.log(url);
    return axiosClient.get(url);
  }
}