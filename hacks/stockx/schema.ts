import mongoose from 'mongoose';

export function initDb() {    
  return new Promise<void>((resolve, reject) => {
    mongoose.connect('mongodb://localhost:27017/stockx', { useNewUrlParser: true });
    const db = mongoose.connection;

    db.once('open', () => resolve());
    db.on('error', (err) => reject(err));
  });
}

const CompleteSchema = new mongoose.Schema({
  gender: String,
  brand: String,
  releaseTime: String,
  completed: {
    type: Boolean,
    default: false
  } 
}, { timestamps: true });

CompleteSchema.index({ gender: 1, brand: 1, releaseTime: 1 }, { unique: true });
const CompleteModel = mongoose.model('Complete', CompleteSchema);

const ProductSchema = new mongoose.Schema({
  stockxId: String,
  brand: String,
  category: String,
  gender: String,
  media: {
    type: {
      imageUrl: String,
      smallImageUrl: String,
      thumbUrl: String,
      gallery: [String]
    }
  },
  name: String,
  productCategory: String,
  releaseDate: Date,
  releaseTime: Number,
  retailPrice: Number,
  shoe: String,
  urlKey: String,
  styleId: String,
  year: Number,
  title: String,
  tags: { type: [String] }
});

ProductSchema.index({ stockxId: 1 }, { unique: true });
const ProductModel = mongoose.model('Product', ProductSchema);

export {
  ProductModel,
  CompleteModel
};