import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    cartItem: 0,
    productsInCart: []
  },
  mutations: {
    addProducts (state, payload) {
      this.products = payload;
    },
    addCartItem (state, payload) {
      state.cartItem += 1
      state.productsInCart.push(payload)
    },
    removeCartItem (state, payload) {
      state.cartItem -= 1
      state.productsInCart.pop(payload)
    }
  }, 
  getters: {

  },
  actions: {
    addProducts (context, payload) {
      context.commit('addProducts', payload);
    },
    addCartItem (context, payload) {
      context.commit('addCartItem', payload)
    },
    removeCartItem (context, payload) {
      context.commit('removeCartItem', payload)
    }
  }
})
