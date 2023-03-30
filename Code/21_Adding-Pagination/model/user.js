const {Schema, model} = require('mongoose');
const {hash, compare, genSalt} = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
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
    default: 'Male',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await genSalt(12);
    const passHash = await hash(this.password, salt);
    this.password = passHash;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const match = await compare(password, this.password);
    return match;
  } catch (err) {
    return false;
  }
};

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
      gender: 'M',
    });
    await admin.save();
  } catch (err) {
    console.error(err);
  }
};


// class User {

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
