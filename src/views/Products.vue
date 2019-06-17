<template>
  <div class="about">
    <v-content>
      <h1>Products</h1>

      <v-layout>
        <v-flex xs12 sm6 offset-sm3>
          <v-card v-for="product in products" :key="product.id">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ product.name }}</h3>
                <h4>{{ product.price }}</h4>
                <h4>{{ product.stock }}</h4>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat color="orange">Add to cart</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-content>
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
  methods: {},
  created() {
    db.collection("products")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          const data = {
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            stock: doc.data().stock
          };

          this.products.push(data);
        });
      });
  }
};
</script>

