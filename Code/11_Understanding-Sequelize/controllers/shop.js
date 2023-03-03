const Product = require('../model/product');

const getProducts = async (_, res) => {
  try {
    const products = await Product.findAll();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  } catch (err) {
    console.error(err);
  }
};

const getProduct = async (req, res) => {
  const {prodId} = req.params;
  console.log({prodId});
  try {
    // const [product] = await Product.findAll({where: {id: prodId}});
    const product = await Product.findByPk(prodId);
    console.log({product});
    res.render('shop/product-detail', {
      product,
      path: '/products',
      pageTitle: product.title,
    });
  } catch (err) {
    console.error(err);
  }
};

const getIndex = async (_, res) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  } catch (err) {
    console.error(err);
  }
};

const getCart = async (req, res) => {
  const cart = await req.user.getCart();
  const products = await cart.getProducts();
  res.render('shop/cart', {
    products,
    totalPrice: cart.totalPrice,
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

const getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders({include: ['products']});
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders,
    });
  } catch (err) {
    console.error(err);
  }
};

const postAddToCart = async (req, res) => {
  const {productId} = req.body;
  try {
    const cart = await req.user.getCart();
    const [product] = await cart.getProducts({where: {id: productId}});
    console.log({product});
    if (product) {
      // update the product quantity in cart
      const newQuantity = product.cartItem.quantity + 1;
      await product.cartItem.update({quantity: newQuantity});
    } else {
      // add the product to cart
      const productToAdd = await Product.findByPk(productId);
      await cart.addProduct(productToAdd, {through: {quantity: 1}});
    }
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
  }
};

const postCartDeleteItem = async (req, res) => {
  const {productId} = req.body;
  try {
    const cart = await req.user.getCart();
    const [product] = await cart.getProducts({where: {id: productId}});
    await product.cartItem.destroy();
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
  }
};

const postOrder = async (req, res) => {
  try {
    // get the cart
    const cart = await req.user.getCart();
    // get the products in the cart
    const products = await cart.getProducts();
    console.log({products});
    // create an order
    const order = await req.user.createOrder();
    // add the products to the order
    await order.addProducts(
      products.map(product => {
        product.orderItem = {quantity: product.cartItem.quantity};
        return product;
      })
    );
    // clear the cart
    await cart.setProducts(null);
    res.redirect('/orders');
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postAddToCart,
  postCartDeleteItem,
  postOrder,
  getOrders,
};
