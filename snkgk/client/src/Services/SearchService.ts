import axios from 'axios';

export async function search(page: number, title: string) {
  const {data} = await axios.get(
    `https://localhost:3000/api/search?page=${page}&limit=20&title=${title}`,
  );

  console.log(data);
  return data;
}
