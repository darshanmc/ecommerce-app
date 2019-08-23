<template>
  <v-container>
    <h2 class="display-2 mb-4">Shopping Cart</h2>

    <v-list two-line>
      <template v-for="(product, index) in products">
        <v-list-tile :key="product.id" avatar>
          <v-list-tile-avatar>
            <img :src="product.images[0]">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="product.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="product.name"></v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile>
            ₹{{product.price}}
          </v-list-tile>

          <v-list-tile-action>
            <v-text-field label="Quantity" reverse :value="product.qty" mask="#"></v-text-field>
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

        <v-divider v-if="index + 1 < products.length" :key="index"></v-divider>
      </template>
      <v-divider></v-divider>
       <v-list-tile>
         <v-spacer></v-spacer>
           Cart Total: ₹{{ cartTotal }}
       </v-list-tile>
    </v-list>

    <v-container>
      <v-btn color="success" larger style="float: right;">Place order</v-btn>
      <v-btn color="success" larger style="float: right;">Update Cart</v-btn>
    </v-container>
  </v-container>

</template>

<script>
export default {
  data() {
    return {
      qty: 1
    };
  },
  computed : {
    products () {
      return this.$store.state.productsInCart
    },
    cartTotal () {
      var tot = 0;
      this.$store.state.productsInCart.forEach(product => {
        tot += parseFloat(product.price);
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
    }
  }
};
</script>

<style>
</style>
