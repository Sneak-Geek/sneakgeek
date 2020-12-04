import { CompleteModel, initDb, ProductModel } from "./schema";
import { getBrands, getProduct, getReleaseTime } from "./stockxapi";
import mongoose from 'mongoose'

const nonPanic = ['BulkWriteError'];
const topBrand = [
  "Nike",
  "adidas",
  "Jordan",
  "Vans",
  "New Balance",
  "Converse",
  "Reebok",
  "Puma",
  "Balenciaga",
  "Under Armour",
  "OFF-WHITE",
  "Gucci",
  "Fila",
  "Timberland",
  "Dior",
  "BAPE",
  "Yeezy",
  "Louis Vuitton",
  "Alexander McQueen",
  "Dr. Martens",
  "Salomon",
  "FEAR OF GOD",
];

export async function getRecords() {
  const brands = await getBrands();
  const genders = ["men", "women"];
  
  for (let gender of genders) {
    for (let brand of brands) {
      const releaseTime = await getReleaseTime(brand);
      
      try {
        const result = releaseTime.map(t => ({
          gender: gender,
          brand: brand,
          releaseTime: t,
          completed: false
        }));
        console.log("Result", result);
        await CompleteModel.insertMany(result, { ordered: false });
      } catch (e) {
        if (!nonPanic.some(p => p === e.name)) {
          console.error(e);
          process.exit(1);
        }
      }
    }
  }
};

async function scrappers() {
  const docs: Array<any & Document>= await CompleteModel.find({ brand: {$in: topBrand }, completed: false });
  console.log(`Processing ${docs.length} documents`);

  docs.forEach((record) => {
    const timeout = setTimeout(async () => {
      try {
        const products = await getProduct(record.gender, record.brand, record.releaseTime);
        console.log(`Adding ${products.length}: ${record.brand}, ${record.gender}, ${record.releaseTime}`);
        await Promise.all([
          CompleteModel.updateOne({ _id: mongoose.Types.ObjectId(record.id)}, { completed: true }),
          ProductModel.insertMany(products.map(p => ({
            stockxId: p.id,
            brand: p.brand,
            category: p.category,
            gender: p.gender,
            media: p.media,
            name: p.name,
            productCategory: p.productCategory,
            releaseDate: p.releaseDate ?? new Date(p.releaseDate),
            releaseTime: p.releaseTime,
            retailPrice: p.retailPrice,
            shoe: p.shoe,
            urlKey: p.urlKey,
            styleId: p.styleId,
            year: p.year,
            title: p.title,
            tags: p.tags
          })), { ordered: false }) 
        ]);
      } catch (e) {
        if (e.name !== "MongoError" && e.name !== "BulkWriteError") {
          console.log(e.name);
          console.error(e);
          process.exit(1);
        }
      } finally {
        clearTimeout(timeout);
      }
    }, 1500);
  });
}

initDb()
// .then(() => getRecords())
.then(() => scrappers());