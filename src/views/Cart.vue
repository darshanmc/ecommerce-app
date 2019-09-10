<template>
  <v-container>
    <h2 class="display-2 mb-4">Shopping Cart</h2>

    <v-alert v-for="(feedback, index) in messages" :key="index" :value="true" type="error">{{ feedback }}</v-alert>

    <v-list two-line>
      <v-list-tile v-if="!hasProducts">
            <h3>Your cart is empty!</h3>
      </v-list-tile>
      <template>
        <v-list-tile v-for="product in products" :key="product.id" avatar>
          <v-list-tile-avatar>
            <img :src="product.images[0]">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="product.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="product.description"></v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile>
            ₹{{product.price}}
          </v-list-tile>

          <v-list-tile-action>
            <v-text-field label="Quantity" reverse :value="product.qty" mask="#" :id="product.id" @blur="changeQuantity(product)"></v-text-field>
          </v-list-tile-action>

          <v-list-tile>
            ₹{{product.price * product.qty}}
          </v-list-tile>

          <v-list-tile-action>
            <v-btn icon ripple @click="removeItem(product)">
              <v-icon color="red lighten-1">delete</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>

      </template>
      <v-divider></v-divider>
       <v-list-tile>
         <v-spacer></v-spacer>
           Cart Total: ₹{{ cartTotal }}
       </v-list-tile>
    </v-list>

    <v-container>
      <router-link :to="{ name: 'checkout'}">
        <v-btn :disabled="!checkoutEnabled" color="success" larger style="float: right;">Checkout</v-btn>
      </router-link>  
    </v-container>
  </v-container>

</template>

<script>
export default {
  data() {
    return {
      qty: 1,
      feedbacks : []
    };
  },
  computed : {
    products () {
      return this.$store.state.productsInCart
    },
    hasProducts() {
      return this.$store.state.productsInCart.length > 0;
    },
    checkoutEnabled () {
      return this.feedbacks.length === 0 && this.$store.state.productsInCart.length > 0;
    },
    messages () {
      return this.feedbacks;
    },
    cartTotal () {
      var tot = 0;
      this.$store.state.productsInCart.forEach(product => {
        tot += parseFloat(product.price * product.qty);
      });
      return tot;
    }
  },
  methods: {
    removeItem: function(product) {
      this.$store.dispatch("removeCartItem", product);
    },
    updateQuantity(product) {
      product.qty = this.qty;
    },
    changeQuantity(product) {
      let qty = document.getElementById(product.id).value;
      
        this.$store.dispatch("changeQuantity", {
          id : product.id,
          qty : qty
        });
      
      this.validate();
    },
    validate () {
      this.feedbacks = [];
      let products = this.$store.state.productsInCart;
      products.forEach(product => {
        if (!this.$store.getters.quantityCheck({ qty : product.qty, stock : product.stock })) {
          this.feedbacks.push(`${product.qty} items are not available for ${product.name}!`);
        }
      })
      return this.feedbacks;
    }
  },
  created () {
    this.validate();
  }
};
</script>

<style>
</style>
