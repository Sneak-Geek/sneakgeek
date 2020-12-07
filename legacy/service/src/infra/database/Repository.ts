// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";

export type Document<T> = T & mongoose.Document;
export type Repository<T extends mongoose.Document> = mongoose.Model<T>;
