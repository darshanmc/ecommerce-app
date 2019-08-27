import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import About from './views/About.vue'
import Products from './views/Products.vue'
import Cart from './views/Cart.vue'
import Dashboard from './views/Dashboard.vue'
import NewProduct from './views/NewProduct.vue'
import ProductDetail from './views/ProductDetail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'products',
      component: Products
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/carts',
      name: 'cart',
      component: Cart
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/newproduct',
      name: 'newproduct',
      component: NewProduct
    },
    {
      path: '/detail/:product_slug',
      name: 'productdetail',
      component: ProductDetail
    }
  ]
})
