import axiosClient from '../api/axiosClient';
import { IBookAPI } from '../types/book';

export class BookAPI {
  static async getAllBooks(): Promise<Array<IBookAPI>> {
    const url: string = "api/v1/product/getBook";
    return axiosClient.get(url)
  }
  static getBookId(id: number) {
    const url: string = `api/v1/product/getBook/${id}`;
    // console.log("Đường dẫn", url);
    return axiosClient.get(url);
  }

  static postComment(data: any) {
    const url: string = "api/v1/comment";
    return axiosClient.post(url, data);
  }

  static getCommentByIdProduct(id: number) {
    const url: string = `api/v1/comment/${id}`;
    // console.log("Đường dẫn", url);
    return axiosClient.get(url);
  }

  static postFavorite(data: number) {
    const url: string = "api/v1/favorite";
    return axiosClient.post(url, data)
  }

  static getFavoriteById(id: number) {
    const url: string = `api/v1/favorite/${id}`;
    return axiosClient.get(url)
  }

  static deleteFavorite(id: number) {
    const url: string = `api/v1/favorite/${id}`;
    return axiosClient.delete(url)
  }
}