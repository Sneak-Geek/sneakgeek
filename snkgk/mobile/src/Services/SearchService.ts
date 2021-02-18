import {Shoes} from '../Model/Shoes';
import axiosClient from './axios';

export async function search(page: number, title: string): Promise<Shoes[]> {
  const {
    data: {shoes},
  } = await axiosClient.get(`/search?page=${page}&limit=25&title=${title}`);

  return shoes;
}
