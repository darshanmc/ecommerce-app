import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    cartItem: 0,
    productsInCart: [],
    displayName: null,
    role: null
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
    }, 
    setDisplayName (state, payload) {
      state.displayName = payload
    },
    unsetDisplayName (state) {
      state.displayName = null
    },
    setRole(state, payload) {
      state.role = payload
    },
    unsetRole(state) {
      state.role = null
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
    },
    setDisplayName(context, payload){
      context.commit('setDisplayName', payload)
    },
    unsetDisplayName(context){
      context.commit('unsetDisplayName')
    },
    setRole(context, payload){
      context.commit('setRole', payload)
    },
    unsetRole(context){
      context.commit('unsetRole')
    }
  }
})
