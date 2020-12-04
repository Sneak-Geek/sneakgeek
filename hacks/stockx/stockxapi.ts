import axios from 'axios';

const baseUrl = 'https://stockx.com/api/browse';
const headers = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36"
}
const proxy = {
  host: '127.0.0.1',
  port: 8118 
};

type StockxResponse = {
  Facets: {
    year: { [key: string]: number },
    brand: { [key: string]: number },
    releaseTime: { [key: string]: number }
  },
  Products: Array<{
    id: string,
    brand: string,
    category: string,
    childId: string | Array<string>,
    gender: string,
    doppelgangers: Array<any>,
    media: {
      imageUrl: string,
      smallImageUrl: string,
      thumbUrl: string,
      gallery: string[]
    },
    name: string,
    productCategory: string,
    releaseDate: string,
    releaseTime: number,
    retailPrice: number,
    shoe: string,
    urlKey: string,
    styleId: string,
    year: number,
    title: string,
    tags: Array<string>
  }>
};

export async function getBrands(): Promise<string[]> {
  const { data } = await axios.get(`${baseUrl}?productCategory=sneakers`, { 
    headers,
  });
  const brands = (data as StockxResponse).Facets.brand;
  
  return Object.keys(brands);
}

export async function getReleaseTime(brand: string): Promise<string[]> {
  const { data } = await axios.get(`${baseUrl}?productCategory=sneakers&brand=${brand}`, { headers });
  const years = (data as StockxResponse).Facets.releaseTime;

  return Object.keys(years || []).sort((a, b) => parseFloat(b) - parseFloat(a));
}

export async function getProduct(gender: string, brand: string, releaseTime: string) {
  const { data } = await axios.get(`${baseUrl}?productCategory=sneakers&brand=${brand}&gender=${gender}&releaseTime=${releaseTime}`, { headers });

 return (data as StockxResponse).Products; 
}