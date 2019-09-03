import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    cartItem: 0,
    productsInCart: [],
    displayName: null,
    role: null,
    isAdmin : false
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
      state.isAdmin = false
    },
    deleteProduct (state, payload) {
      state.products = state.products.filter(product => {
        if (payload.id != product.id){
          return true;
        }
      })
    },
    addNewProduct (state, payload){
      state.products.push(payload);
    }
  }, 
  getters: {
    isAdmin: state => {
      if (state.role === "admin") {
        state.isAdmin = true;
      }
      return state.isAdmin;
    }
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
    },
    deleteProduct (context, payload){
      context.commit('deleteProduct', payload)
    },
    addNewProduct (context, payload){
      context.commit('addNewProduct', payload)
    }
  }
})
