import { CompleteModel, initDb, ProductModel } from "./schema";
import { getProducts2, getYearlyRecord } from "./stockxapi";
import mongoose from 'mongoose'

const nonPanic = ['BulkWriteError'];
const topBrand = [
  "Nike",
  "adidas",
  "Jordan",
  "Vans",
  "Converse",
  "Balenciaga",
  "OFF-WHITE",
  "Gucci",
  "Dior",
  "BAPE",
  "Yeezy",
  "Louis Vuitton",
  "FEAR OF GOD",
];

const genders = ["men", "women", "unisex", "child", "preschool", "toddler"];
// const genders = ["none"];

function insertProducts(products: Array<any>) {
  return ProductModel.insertMany(products.map(p => ({
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
}

async function scrappers2() {
  const docs: Array<any> = await CompleteModel.find({ completed: false }).sort({ year: -1 }).exec();
  docs.forEach(rec => {
    const timeout = setTimeout(async () => {
      try {
        const promiseQueries = [];
        const query = { "brand": rec.brand, "year": rec.year, "gender": rec.gender };
        if (!rec.gender) {
          console.error("Empty gender: ", rec);
          return;
        }
        if (rec.count <= 1000) {
          query["resultsPerPage"] = rec.count;
          promiseQueries.push(getProducts2(query));
        } else {
          const lastPage = rec.count / 1000 + 1;
          for (let i = 0; i < lastPage; i++) {
            const q = { ...query, "resultsPerPage": "1000", "page": i.toString() };
            promiseQueries.push(getProducts2(q));
          }
        }
        const results = await Promise.all(promiseQueries);
        const products = results.reduce((prev, cur=[]) => [...cur, ...prev]);
        if (products.length === 0) {
          console.log("Empty products", rec);
          return;
        }
        console.log(`Adding ${products.length} with record ${rec.brand}, ${rec.year}, count: ${rec.count}`);
        await Promise.all([
          CompleteModel.updateOne({ _id: mongoose.Types.ObjectId(rec._id) }, { completed: true }),
          insertProducts(products)
        ]);
      } catch (e) {
        if (e.name !== "MongoError" && e.name !== "BulkWriteError") {
          console.error(e);
          process.exit(1);
        }
      } finally {
        clearTimeout(timeout);
      }
    }, 6500);
  });
}

export async function getRecords2() {
  if ((await CompleteModel.countDocuments()) > 0) {
    return;
  }

  for (let gender of genders) {
    for (let brand of topBrand) {
      try {
        const records = await getYearlyRecord(brand, gender);
        const result = [];
        if (!records) {
          console.log("Error getting records", records, brand, gender);
          continue;
        }
        for (let year in records) {
          const x = {
            brand,
            year,
            count: records[year],
            gender
          };
          result.push(x);
        }
        await CompleteModel.insertMany(result, { ordered: false });
      } catch (e) {
        if (!nonPanic.some(p => p === e.name)) {
          console.error(e);
          process.exit(1);
        }
      }
    }
  }
}

initDb()
  .then(() => getRecords2())
  .then(() => scrappers2())
  .catch(e => {
    console.error(e);
    process.exit(1);
  });