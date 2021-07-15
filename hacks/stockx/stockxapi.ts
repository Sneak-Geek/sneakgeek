import axios from 'axios';

const baseUrl = 'https://stockx.com/api/browse?productCategory=sneakers';
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36'
}

type StockxResponse = {
  Facets: {
    year: { [key: string]: number };
    brand: { [key: string]: number };
    releaseTime: { [key: string]: number }
  };
  Products: Array<Product>
};

type Product = {
  id: string;
  brand: string;
  category: string;
  childId: string | Array<string>;
  gender: string;
  description: string;
  doppelgangers: Array<any>;
  media: {
    360?: Array<string>;
    imageUrl: string;
    smallImageUrl: string;
    thumbUrl: string;
    gallery: string[]
  };
  name: string;
  productCategory: string;
  releaseDate: string;
  releaseTime: number;
  retailPrice: number;
  shoe: string;
  urlKey: string;
  styleId: string; // SKU
  year: number;
  title: string;
  tags: Array<string>;

};

export async function getBrands(): Promise<string[]> {
  const { data } = await axios.get(`${baseUrl}`, { 
    headers,
  });
  const brands = (data as StockxResponse).Facets.brand;
  
  return Object.keys(brands);
}

export async function getYearlyRecord(brand: string, gender: string): Promise<{[year: string]: number}> {
  const { data } = await axios.get(`${baseUrl}&brand=${brand}&gender=${gender}`, { headers });
  return data.Facets.year;
}

export async function getReleaseTime(brand: string): Promise<string[]> {
  const { data } = await axios.get(`${baseUrl}&brand=${brand}`, { headers });
  const years = (data as StockxResponse).Facets.releaseTime;

  return Object.keys(years || []).sort((a, b) => parseFloat(b) - parseFloat(a));
}

export async function getProducts(gender: string, brand: string, releaseTime: string) {
  const { data } = await axios.get(`${baseUrl}&brand=${brand}&gender=${gender}&releaseTime=${releaseTime}&resultsPerPage=500`, { 
    headers 
  });

 return (data as StockxResponse).Products; 
}

export async function getProducts2(params: {[key: string]: string}, url = baseUrl) {
  for (let key in params) {
    url = `${url}&${key}=${params[key]}`;
  }
  console.log("Query URL", url);
  const { data } = await axios.get(url, { headers });
  return data.Products;
}

export async function getProductsWithMap(map: Map<string, string>) {
  let query = '';
  map.forEach((value, key) => query = `${key}=${value}&${query}`);

  const { data } = await axios.get(`${baseUrl}&${query}`, { headers });
  
  return (data as StockxResponse).Products;
}

export async function getProductDetail(prodStockxId: string): Promise<Product> {
  const { data } = await axios.get(`https://stockx.com/api/products/${prodStockxId}`, { headers });

  return data.Product as Product;
}