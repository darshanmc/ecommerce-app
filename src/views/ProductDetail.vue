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
          <v-carousel-item v-for="(item,i) in product.images" :key="i" :src="item"></v-carousel-item>
        </v-carousel>
      </v-flex>

      <v-flex md4 sm12 xs12>
        <v-card color="#fafafa">
          <v-card-text>
           <u> Description: </u> <br>
           {{ product.description }}
          </v-card-text>
        </v-card>
        <br>
        <v-card color="#fafafa">
          <v-card-text>
            <u> Remaining: </u> 
            <br />
            {{ product.stock }}
          </v-card-text>
        </v-card>
          <br>
        <v-card color="#fafafa">
          <v-card-text>
            <u> Price: </u>
            <br />
            ₹{{ product.price }}
          </v-card-text>
        </v-card>
        <br>
        <v-btn @click="addItem()">
          Add to Cart
          <v-icon right color="#ff9f00">add_shopping_cart</v-icon>
        </v-btn>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import db from "./fireconf";

export default {
  name: "ProductDetail",
  data() {
    return {
      product: {
        id: null,
        name: "",
        description: "",
        price: null,
        stock: null,
        images: [],
        slug: null,
        qty: 1
      }
    };
  },
  methods: {
    addItem () {
      this.$store.dispatch("addCartItem", this.product);
    }
  },
  created() {
    let ref = db
      .collection("products")
      .where("slug", "==", this.$route.params.product_slug);
    
    ref.get().then(snapshot => {
      if (!snapshot.empty){
        snapshot.forEach(doc => {
          this.product.id = doc.id;
          this.product.images = doc.data().images;
          this.product.name = doc.data().name;
          this.product.stock = doc.data().stock;
          this.product.description = doc.data().description;
          this.product.price = doc.data().price;
          this.product.slug = doc.data().slug;
        });
      }
      
      this.dialog = false;
    });
  }
};
</script>

<style>
</style>l
