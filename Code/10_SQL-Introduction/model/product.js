const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const {generateUniqueID} = require('../util/numbers');

class Product {
  constructor({id = null, title, imageUrl, description, price}) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  async save() {
    try {
      if (this.id) {
        return await db.execute(
          'UPDATE products SET title = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?',
          [this.title, this.price, this.description, this.imageUrl, this.id]
        );
      } else {
        this.id = generateUniqueID();
        console.log(`New product: ${this.id} at: ${new Date()}`);
        return await db.execute(
          'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
          [this.title, this.price, this.description, this.imageUrl]
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchAll() {
    try {
      const [products] = await db.execute('SELECT * FROM products');
      return products;
    } catch (err) {
      console.error(err);
    }
  }

  static async findById(id) {
    try {
      const [[product]] = await db.execute(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      return product;
    } catch (err) {
      console.error(err);
    }
  }

  static async deleteById(id) {
    try {
      const [product] = await db.execute(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      await db.execute('DELETE FROM products WHERE id = ?', [id]);
      return product;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Product;
