const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const cartPath = path.join(rootDir, 'data', 'cart.json');

class Cart {
  static addProduct(id, productPrice) {
    // fetch the previous cart
    fs.readFile(cartPath, (err, content) => {
      const cart = err ? {products: [], totalPrice: 0} : JSON.parse(content);
      // find existing product
      const prodIdx = cart.products.findIndex(prod => prod.id === id);
      const foundProd = cart.products[prodIdx];
      // add new product or increase quantity
      console.log({foundProd});
      prodIdx >= 0
        ? (cart.products[prodIdx] = {
            ...foundProd,
            qty: foundProd.qty + 1,
          })
        : cart.products.push({id, qty: 1});
      // add price to total price
      cart.totalPrice += +productPrice;
      // write the file
      fs.writeFile(cartPath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static removeProduct(id, productPrice, {deleteProduct = false} = {}) {
    // fetch the previous cart
    fs.readFile(cartPath, (err, content) => {
      if (err) return;
      const cart = JSON.parse(content);
      // find existing product
      const prodIdx = cart.products.findIndex(prod => prod.id === id);
      const remove = () => {
        const foundProd = cart.products[prodIdx];
        if (!foundProd) return;
        // remove product or decrease quantity
        foundProd.qty === 1
          ? (cart.products = cart.products.filter(prod => prod.id !== id))
          : (cart.products[prodIdx] = {
              ...foundProd,
              qty: foundProd.qty - 1,
            });
        // remove price from total price
        cart.totalPrice -= +productPrice;
        deleteProduct && foundProd.qty - 1 > 0 && remove();
      };
      remove();
      // write the file
      fs.writeFile(cartPath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(cartPath, (err, content) => {
      err ? cb(null) : cb(JSON.parse(content));
    });
  }
}

module.exports = Cart;
