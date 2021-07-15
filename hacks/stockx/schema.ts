import mongoose from 'mongoose';

// const url = 'mongodb+srv://admin:prosneakgeekadmin@sneakgeek-dev-cluster.b96ec.mongodb.net/stockx?retryWrites=true&w=majority';
const url = 'mongodb://localhost:27017/stockx';

export function initDb() {
  return new Promise<void>((resolve, reject) => {
    mongoose.connect(url, { useNewUrlParser: true });
    const db = mongoose.connection;

    db.once('open', () => resolve());
    db.on('error', (err) => reject(err));
  });
}

const CompleteSchema = new mongoose.Schema({
  brand: String,
  year: String,
  count: Number,
  completed: {
    type: Boolean,
    default: false
  },
  gender: String,
}, { timestamps: true });
const CompleteModel = mongoose.model('Complete2', CompleteSchema);

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
  styleId: {
    type: String,
    unique: true
  },
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