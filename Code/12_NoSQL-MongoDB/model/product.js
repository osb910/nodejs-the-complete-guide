const {ObjectId} = require('mongodb');

const {
  insertOne,
  updateOne,
  findMany,
  findOne,
  deleteOne,
} = require('../util/database');
const {getIdString} = require('../util/numbers');

class Product {
  constructor({title, price, description, imageUrl, id, userId}) {
    this.title = title;
    this.price = +price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId ? new ObjectId(userId) : null;
  }

  async save() {
    try {
      const result = this._id
        ? await updateOne('products', {_id: this._id}, {$set: this})
        : await insertOne('products', this);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchAll() {
    try {
      const documents = await findMany('products');
      return documents;
    } catch (err) {
      console.error(err);
    }
  }

  static async findById(prodId) {
    try {
      return await findOne('products', {_id: new ObjectId(prodId)});
    } catch (err) {
      console.error(err);
    }
  }

  static async deleteById(prodId) {
    try {
      return await deleteOne('products', {_id: new ObjectId(prodId)});
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Product;
