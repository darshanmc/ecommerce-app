<template>
  <div class="about">
    <v-container fluid grid-list-md>
      <v-layout row wrap align-center>
        <v-flex xs12 md3 offset-sm1 v-for="product in products" :key="product.id">
          <v-card>
            <v-img :src="product.images[0]" height="150px"></v-img>

            <v-card-title primary-title>
              <div>
                <div class="headline">{{ product.name }}</div>
                <span class="grey--text">Rs. {{ product.price }}</span>
                <div class="grey--text">Remaining: {{ product.stock }}</div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn icon large v-on:click="addItem(product)">
                <v-icon>add_shopping_cart</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import db from "./fireconf";

export default {
  data() {
    return {
      products: []
    };
  },
  methods: {
    loadProducts: function() {
      db.collection("products")
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            const data = {
              id: doc.id,
              name: doc.data().name,
              price: doc.data().price,
              stock: doc.data().stock,
              images: doc.data().images
            };

            this.products.push(data);
          });
        });
    },
    addItem: function(product) {
      this.$store.dispatch("addCartItem", product);
    }
  },
  created() {
    this.products = this.$store.state.products;
    if (this.products.length === 0) {
      this.loadProducts();
      this.$store.dispatch("addProducts", this.products);
    }
  }
};
</script>

