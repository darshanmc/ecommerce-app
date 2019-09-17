import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import About from './views/About.vue'
import Products from './views/Products.vue'
import Cart from './views/Cart.vue'
import Dashboard from './views/Dashboard.vue'
import NewProduct from './views/NewProduct.vue'
import ProductDetail from './views/ProductDetail.vue'
import Checkout from './views/Checkout.vue'
import OrderSummary from './views/OrderSummary.vue'
import OrderDetail from './views/OrderDetail.vue'
import EditProduct from './views/EditProduct.vue'

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
    },
    {
      path: '/edit/:product_slug',
      name: 'editproduct',
      component: EditProduct
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/summary',
      name: 'ordersummary',
      component: OrderSummary
    },
    {
      path: '/orderdetail',
      name: 'orderdetail',
      component: OrderDetail
    }
  ]
})
