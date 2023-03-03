const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const Cart = require('./cart');

const productsPath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(productsPath, (err, content) => {
    const products = err ? cb([]) : cb(JSON.parse(content));
    return products;
  });
};

class Product {
  constructor({id = null, title, imageUrl, description, price}) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      // update existing product
      if (this.id) {
        const existingProductIdx = products.findIndex(
          prod => prod.id === this.id
        );
        products[existingProductIdx] = this;
        // add new product
      } else {
        this.id = Math.random().toString();
        products.push(this);
      }
      // write to file
      fs.writeFile(productsPath, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      cb(product);
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const filteredProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(productsPath, JSON.stringify(filteredProducts), err => {
        if (!err) {
          return Cart.removeProduct(id, product.price, {deleteProduct: true});
        }
        console.log(err);
      });
    });
  }
}

module.exports = Product;
