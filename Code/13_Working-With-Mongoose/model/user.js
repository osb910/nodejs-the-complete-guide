const {ObjectId} = require('mongodb');
const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [ {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    } ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDeveloper: {
    type: Boolean,
    default: false,
  },
  isAligner: {
    type: Boolean,
    default: false,
  },
  isTranslator: {
    type: Boolean,
    default: false,
  },
  isArab: {
    type: Boolean,
    default: false,
  },
  location: {
    country: String,
    city: String,
    address: String,
    postalCode: String,
  },
});

userSchema.methods.addToCart = async function (product, quantity = 1) {
  const isProductInCart = this.cart.items.some(cp => cp.productId.toString() === product._id.toString());
  const priceIncrement = {'cart.totalPrice': product.price * quantity};

  const result = isProductInCart
    ? await this.updateOne({
        $inc: {'cart.items.$[el].quantity': quantity, ...priceIncrement},
      }, {arrayFilters: [{'el.productId': product._id}]
    })
    : await this.updateOne({
      $push: {'cart.items': {productId: product._id, quantity: 1}}, $inc: priceIncrement
    });
  return result;
};

userSchema.methods.removeFromCart = async function (productId) {
  const {cart: {items, totalPrice}} = await this.populate({path: 'cart.items.productId'});
  const cartProduct = await items.find(cp => cp.productId._id.toString() === productId);
  if (!cartProduct) return;
  const priceDecrement = {'cart.totalPrice': -cartProduct.productId.price * cartProduct.quantity};
  const result = await this.updateOne({
      $pull: {'cart.items': {productId}}, $inc: priceDecrement
  });
  return result;
};

userSchema.methods.getCart = async function () {
  try {
      const {cart} = await this.populate({path: 'cart.items.productId'});
      const items = cart.items.map(({productId, quantity}) => ({product: {...productId._doc}, quantity}));
      return {items, totalPrice: cart.totalPrice};
  } catch (err) {
      console.error(err);
  }
};

userSchema.methods.clearCart = async function () {
  try {
    return await this.updateOne({$set: {cart: {items: [], totalPrice: 0}}});
  } catch (err) {
    console.error(err);
  }
};

const User = model('User', userSchema);

const createAdmin = async () => {
  try {
    const admin = new User({
      name: 'Omar Admin',
      email: 'omarshdev@gmail.com',
      emailVerified: true,
      isAdmin: true,
      isDeveloper: true,
      isAligner: true,
      isTranslator: true,
      isArab: true,
      gender: 'M',
    });
    await admin.save();
  } catch (err) {
    console.error(err);
  }
};


// class User {
//
//
//   static async findByEmail(email) {
//     try {
//       return await findOne('users', {email});
//     } catch (err) {
//       console.error(err);
//     }
//   }
//
//   static async getOrders(userId) {}
//
//   static async deleteOrder(userId, orderId) {}
//
//   static async deleteAllOrders(userId) {}
//
//   static async confirmEmail(userId) {}
//
//   static async resetPassword(userId) {}
//
//   static async changePassword(userId) {}
//
//   static async changeEmail(userId) {}
//
//   static async changeName(userId) {}
//
//   static async deleteAccount(userId) {}
// }

module.exports = {User, createAdmin};
