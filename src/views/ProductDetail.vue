<template>
  <v-container>
    <v-layout column>
      <v-flex align-self-center>
        <h1>{{ product.name }}</h1>
      </v-flex>
    </v-layout>
    <br />
    <v-layout row wrap justify-space-around>
      <v-flex md6 sm12 xs12>
        <v-carousel>
          <v-carousel-item
            v-for="(item,i) in product.imageUrls"
            :key="i"
            :src="item"
          ></v-carousel-item>
        </v-carousel>
      </v-flex>
      <v-flex md4 sm12 xs12>
        <v-layout column wrap justify-end>
          <v-flex md4>
            <h3>{{ product.description }}</h3>
          </v-flex>
          <v-flex md4>
            <p>Available quantity: {{ product.stock }}</p>
          </v-flex>
          <v-flex md4>
            <p>Price: {{ product.price }} </p>
          </v-flex>
          <v-flex md4>
            <v-btn>
              <v-icon>add_shopping_cart</v-icon>Add to Cart
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import db from './fireconf'

export default {
  name: 'ProductDetail',
  data() {
    return {
        product: {
            name: '',
            description: '',
            price: null,
            stock: null,
            imageUrls: []
        }
    };
  },
  created() {
      let ref = db.collection('products').where('slug','==', this.$route.params.product_slug)
      ref
      .get()
      .then(snapshot => {
          snapshot.forEach(doc => {
              this.product.imageUrls = doc.data().images
              this.product.name = doc.data().name
              this.product.stock = doc.data().stock
              this.product.description = doc.data().description
              this.product.price = doc.data().price
          })
      })
  }
};
</script>

<style>
</style>l
