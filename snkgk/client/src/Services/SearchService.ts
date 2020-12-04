import axios from 'axios';
import {Shoes} from '../Model/Shoes';

export async function search(page: number, title: string): Promise<Shoes[]> {
  const {
    data: {shoes},
  } = await axios.get(
    `http://localhost:3000/api/search?page=${page}&limit=25&title=${title}`,
  );

  return shoes;
}
