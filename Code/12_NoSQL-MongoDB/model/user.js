const {ObjectId} = require('mongodb');
const {
  insertOne,
  updateOne,
  findMany,
  findOne,
  deleteOne,
} = require('../util/database');

class User {
  constructor({
    name,
    email,
    cart = {items: [], totalPrice: 0},
    id = null,
    gender = null,
    isAdmin = false,
    isDeveloper = false,
    isAligner = false,
    isTranslator = false,
    isArab = false,
  }) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : null;
    this.emailVerified = false;
    this.gender = gender;
    this.isAdmin = isAdmin;
    this.isDeveloper = isDeveloper;
    this.isAligner = isAligner;
    this.isTranslator = isTranslator;
    this.isArab = isArab;
    this.location = {
        country: null,
        city: null,
        address: null,
        postalCode: null,
    };
  }

  async save() {
    try {
      const result = this._id
        ? await updateOne('users', {_id: this._id}, {$set: this})
        : await insertOne('users', this);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async addToCart(product, quantity = 1) {
    try {
      const isProductInCart = this.cart.items.some(
          cp => cp.productId.toString() === product._id.toString()
      );
      const priceIncrement = +product.price * quantity;
      return isProductInCart
          // increment quantity and total price // BUG: quantity is not incremented
        ? await updateOne('users', {_id: this._id},
              {$inc: {'cart.items.$[el].quantity': quantity,
                  'cart.totalPrice': priceIncrement}},
              {arrayFilters: [{'el._id': product._id}]}
          )
          // add new product to cart
        : await updateOne('users', {_id: this._id},
                {$push: {'cart.items': {productId: product._id, quantity}},
                  $inc: {'cart.totalPrice': priceIncrement}}
          );
      // return await updateOne('users', {_id: this._id},
      //     isProductInCart
      //         // increment quantity by 1
      //         ? {$inc: {'cart.totalPrice': priceIncrement, 'cart.items.$[el].quantity': 1}}
      //         // add new product to cart
      //         : {$push: {'cart.items': {productId: product._id, quantity}}, $inc: {'cart.totalPrice': priceIncrement}},
      //     isProductInCart ? {
      //       arrayFilters: [{'el._id': product._id}]
      //     } : {});
    } catch (err) {
      console.error(err);
    }
  }

  async removeFromCart(productId) {
    try {
      const product = await findOne('products', {_id: new ObjectId(productId)});
      const cartProduct = this.cart.items.find(cp => cp.productId.toString() === productId.toString());
      if (!cartProduct) return;
      return await updateOne('users', {_id: this._id},
          {
            $pull: {'cart.items': {productId: new ObjectId(productId)}},
            $inc: {'cart.totalPrice': -product.price * cartProduct.quantity}
          });
    } catch (err) {
      console.error(err);
    }
  }

  async getCart() {
    const productIds = this.cart.items.map(({productId}) => productId);
    const products = (await findMany('products', {_id: {$in: productIds}}))
        .map(product => ({...product,
          quantity: this.cart.items.find(cp => cp.productId.toString() === product._id.toString()).quantity}));
    return {products, totalPrice: this.cart.totalPrice};
  }

  async clearCart() {
    try {
      return await updateOne('users', {_id: this._id}, {$set: {cart: {items: [], totalPrice: 0}}});
    } catch (err) {
      console.error(err);
    }
  }

  async createOrder() {
    try {
      const cart = await this.getCart();
      const order = {
        items: cart.products,
        user: {
          _id: this._id,
          name: this.name,
          email: this.email,
        },
        totalPrice: cart.totalPrice,
      };
      const result = await insertOne('orders', order);
      await this.clearCart();
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async getOrders() {
    try {
      return await findMany('orders', {'user._id': this._id});
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchAll() {
    try {
      return (await findMany('users'));
    } catch (err) {
      console.error(err);
    }
  }

  static async findById(userId) {
    try {
      return await findOne('users', {_id: new ObjectId(userId)});
    } catch (err) {
      console.error(err);
    }
  }

  static async findByEmail(email) {
    try {
      return await findOne('users', {email});
    } catch (err) {
      console.error(err);
    }
  }

  static async getOrders(userId) {}

  static async deleteOrder(userId, orderId) {}

  static async deleteAllOrders(userId) {}

  static async confirmEmail(userId) {}

  static async resetPassword(userId) {}

  static async changePassword(userId) {}

  static async changeEmail(userId) {}

  static async changeName(userId) {}

  static async deleteAccount(userId) {}
}

const createAdmin = async () => {
  try {
    const admin = new User({
      name: 'Omar',
      email: 'omarshdev@gmail.com',
      isAdmin: true,
      isDeveloper: true,
      isAligner: true,
      isTranslator: true,
      isArab: true,
      gender: 'M',
    });
    admin.emailVerified = true;
    await admin.save();
  } catch (err) {
    console.error(err);
  }
};

module.exports = {User, createAdmin};
