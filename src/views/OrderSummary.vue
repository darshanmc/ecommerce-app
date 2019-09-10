<template>
  <v-container>
    <h2 class="display-2 mb-4">Order Summary</h2>

    <v-layout row>
      <v-flex md8 sm12 xs12>
        <v-card>
          <v-card-text>
            <v-list>
              <v-list-tile v-for="product in products" :key="product.id" avatar>
                <v-list-tile-avatar>
                  <img :src="product.images[0]" />
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title v-html="product.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="product.description"></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile>₹{{product.price}}</v-list-tile>

                <v-list-tile-action>{{ product.qty }}</v-list-tile-action>

                <v-list-tile>₹{{product.price * product.qty}}</v-list-tile>
              </v-list-tile>
              <br />
              <v-divider></v-divider>
              <v-list-tile>
                <v-spacer></v-spacer>
                <h3>Cart Total: ₹{{ cartTotal }}</h3>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-spacer></v-spacer> 
      
      <v-flex md3 sm12 xs12>
        <v-card>
          <v-card-title>
            <h2>Shipping Address</h2>
          </v-card-title>

          <v-card-text>
            <p>
              {{ address.name }}
              <br />
              {{ address.address1 }}
              <br />
              {{ address.address2 }}
              <br />
              {{ address.landmark }}
              <br />
              {{ address.city }}
              <br />
              {{ address.state }}
              <br />
              {{ address.pincode }}
              <br />
              {{ address.mobile }}
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
      
    </v-layout>
    
    <v-layout> 
        <v-flex md2>
        <v-btn :loading="loading" color="success" large style="float: left; margin: auto; margin-top: 10px" @click="placeOrder()">Place Order</v-btn>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import db from './fireconf'

export default {
  data() {
    return {
      productsInCart : [],
      shippingAddress : {},
      loading : false
    };
  },
  methods : {
    updateProducts (products) {
      var prodRef = db.collection("products");
      var localProducts = this.$store.state.products;
      
      products.forEach(product => {
        let stock = product.stock - 1;
        prodRef.doc(product.id).update({
          stock : stock
        }).then(() => {
          let index = localProducts.findIndex(lp => lp.slug === product.slug);
          localProducts[index].stock = stock;
        })
      })
    },
    updateCart() {
      let userId = this.$store.state.userId;
      if (userId){
        db.collection("cart").where("user_id", "==", userId).get().then(snapshot => {
          if (!snapshot.empty){
            snapshot.forEach(docs => {
              docs.ref.update({
                products_in_cart : []
              }).then (() => {
                this.$store.dispatch("clearCart")
              })
            })
          }
        })
      } else {
        this.$store.dispatch("clearCart");
      }
    },
    placeOrder() {
      this.productsInCart = this.$store.state.productsInCart;
      this.shippingAddress = this.$store.state.address;
      var userId = this.$store.state.userId;
      this.loading = true;
      if (this.productsInCart.lenght !== 0 && Object.keys(this.shippingAddress).length !== 0) {
        var orderId = Math.random().toString(10).substr(2, 6); 
        
        db.collection("order").add({
          user_id : userId,
          products : this.productsInCart,
          address : this.shippingAddress,
          order_id : orderId
        }).then( () => {
          // update db products qty
          // update local state products qty
          this.updateProducts(this.productsInCart);
          
          // clear items in cart local and db
          this.updateCart();

          //set order number
          this.$store.dispatch("setOrderNumber", orderId);

          // redirect to next page
          this.$router.push({name : "orderdetail"})

          this.loading = false;
        })
      } else {
        this.loading = false;
      }
    }
  },
  computed: {
    cartTotal() {
      var tot = 0;
      this.$store.state.productsInCart.forEach(product => {
        tot += parseFloat(product.price * product.qty);
      });
      return tot;
    },
    address() {
      return this.$store.state.address;
    },
    products() {
      return this.$store.state.productsInCart;
    }
  }
};
</script>