<template>
  <v-toolbar app>
    <v-toolbar-title>e-commerce</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on }">
          <v-btn icon large v-on="on">
            <div>
              <v-badge left>
                <template v-slot:badge v-if="items != 0">
                  <span>{{items}}</span>
                </template>
                <v-icon>shopping_cart</v-icon>
              </v-badge>
            </div>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-tile v-if="items === 0">
              <v-list-tile-title>Cart is empty</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="product in products" :key="product.id">
              <v-list-tile-action>
                 <v-btn icon v-on:click="removeItem(product)"> 
                   <v-icon>delete</v-icon>
                 </v-btn>
              </v-list-tile-action>
              <v-list-tile-title>{{product.name}}</v-list-tile-title>
            </v-list-tile>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="menu = false" router to="/carts">Checkout</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <v-btn flat router to="/">Home</v-btn>
      <v-btn flat router to="/about">About</v-btn>
      <v-btn flat router to="products">Products</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>


<script>
export default {
  data() {
    return {
      menu: false
    };
  },
  methods: {
    removeItem: function(product) {
      this.$store.dispatch("removeCartItem", product);
    }
  },
  computed: {
    items() {
      return this.$store.state.cartItem;
    },
    products() {
      return this.$store.state.productsInCart;
    }
  }
};
</script>

