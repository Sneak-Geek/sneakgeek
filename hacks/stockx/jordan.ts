import { initDb } from "./schema";
import { getProductDetail, getProductsWithMap } from "./stockxapi";

const getJordans = () => getProductsWithMap(new Map([
  ["brand", "Jordan"],
  ["year", "2021"]
]));

(async () => {
  try {
    const products = await getJordans();
    const details = await Promise.all(products.map(t => t.id).map(p => getProductDetail(p)));
    const result = details.map(t => ({
      media: t.media[360], 
    }));

    console.log("Details\n", details);
    console.log("Result\n", result);
  } catch (error) {
    console.error(error);
  }
})(); 