import Vue from 'vue'
import Vuex from 'vuex'
import db from './views/fireconf'

Vue.use(Vuex)

function updateCartProductsInDB(state) {
  // Updating in Database
  var cartRef = db.collection('cart');
  
  if (state.userId) {
    cartRef
      .where("user_id", "==", state.userId)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          cartRef.add({
            user_id: state.userId,
            products_in_cart: state.productsInCart
          })
        } else {
          snapshot.forEach(doc => {
            doc.ref.set({
              user_id: state.userId,
              products_in_cart: state.productsInCart
            })
          })
        }
      })
  }
}

export default new Vuex.Store({
  state: {
    products: [],
    cartItem: 0,
    productsInCart: [],
    displayName: null,
    userId: null,
    role: null,
    isAdmin: false,
    address : {},
    orderNumber: null,
    orders: []
  },
  mutations: {
    addProducts(state, payload) {
      state.products = payload;
    },
    loadOrders(state, payload){
      state.orders = payload;
    },
    addCartItem(state, payload) {
      var productExists = false;

      state.productsInCart.forEach(product => {
        if (product.id === payload.id) {
          productExists = true;
          let qty = parseInt(product.qty);
          product.qty = qty + 1;
        }
      })

      if (!productExists) {
        state.cartItem += 1
        payload.qty = 1;
        state.productsInCart.push(payload)
      }

      updateCartProductsInDB(state);
    },
    changeQuantity(state, payload) {
      state.productsInCart.forEach(product => {
        if (product.id === payload.id) {
          product.qty = payload.qty;
        }
      })
    },
    removeCartItem(state, payload) {
      state.cartItem -= 1
      state.productsInCart = state.productsInCart.filter(product => {
        if (product.id != payload.id) {
          return true;
        }
      })
      updateCartProductsInDB(state);
    },
    deleteProduct(state, payload) {
      state.products = state.products.filter(product => {
        if (payload.id != product.id) {
          return true;
        }
      })
    },
    addNewProduct(state, payload) {
      state.products.push(payload);
    },
    logout(state) {
      state.role = null
      state.isAdmin = false
      state.displayName = null
      state.cartItem = 0,
      state.productsInCart = [],
      state.userId = null
    },
    login(state, payload) {
      state.role = payload.role,
      state.displayName = payload.displayName,
      state.userId = payload.userId,
      state.cartItem = payload.productsInCart.length,
      state.productsInCart = payload.productsInCart
    },
    addShippingAddress(state, payload) {
      state.address.name = payload.name;
      state.address.address1 = payload.address1;
      state.address.address2 = payload.address2;
      state.address.landmark = payload.landmark;
      state.address.city = payload.city;
      state.address.state = payload.state;
      state.address.pincode = payload.pincode;
      state.address.mobile = payload.mobile;
    },
    clearCart(state) {
      state.productsInCart = [];
      state.cartItem = 0;
    },
    setOrderNumber (state, payload) {
      state.orderNumber = payload;
    }
  },
  getters: {
    isAdmin: state => {
      if (state.role === "admin") {
        state.isAdmin = true;
      }
      return state.isAdmin;
    },
    quantityCheck: () => (obj) => {
      return obj.qty <= obj.stock;
    }
  },
  actions: {
    addProducts(context, payload) {
      context.commit('addProducts', payload);
    },
    loadOrders(context, payload){
      context.commit('loadOrdes', payload)
    },
    addCartItem(context, payload) {
      context.commit('addCartItem', payload)
    },
    removeCartItem(context, payload) {
      context.commit('removeCartItem', payload)
    },
    deleteProduct(context, payload) {
      context.commit('deleteProduct', payload)
    },
    addNewProduct(context, payload) {
      context.commit('addNewProduct', payload)
    },
    changeQuantity(context, payload) {
      context.commit('changeQuantity', payload)
    },
    logout(context) {
      context.commit('logout')
    },
    login(context, payload) {
      context.commit('login', payload)
    },
    addShippingAddress(context, payload) {
      context.commit('addShippingAddress', payload)
    },
    clearCart(context) {
      context.commit('clearCart')
    },
    setOrderNumber(context, payload) {
      context.commit('setOrderNumber', payload)
    }
  }
})
