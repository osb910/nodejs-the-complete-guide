const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(p, (err, content) => {
    const products = err ? cb([]) : cb(JSON.parse(content));
    return products;
  });
};

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  delete() {
    getProductsFromFile(products => {
      const title = this.title;
      const filteredProducts = products.filter(prod => prod.title !== title);
      fs.writeFile(p, JSON.stringify(filteredProducts), err => {
        console.log(err);
      });
    });
  }
}

module.exports = Product;
