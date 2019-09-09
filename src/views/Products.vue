<template>
  <div class="about">
    <v-container fluid grid-list-md>
      <v-alert v-if="feedback" :value="true" type="error">{{ feedback }}</v-alert>

      <v-layout row wrap align-center>
        <v-flex xs12 md3 offset-sm1 v-for="product in displayProducts" :key="product.id">
          <v-card>
            <v-img :src="product.images[0]" height="150px"></v-img>

            <v-card-title primary-title>
              <div>
                <router-link
                  :to="{ name : 'productdetail', params : { product_slug : product.slug}}"
                >
                  <div class="headline">{{ product.name }}</div>
                </router-link>
                <span class="grey--text">₹ {{ product.price }}</span>
                <div class="grey--text">Remaining: {{ product.stock }}</div>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn :disabled="product.qty > product.stock" icon large v-on:click="addItem(product)">
                <v-icon color="#ff9f00">add_shopping_cart</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="isAdmin" icon large @click="confirmation (product)">
                <v-icon color="red">delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- Dialog box for deleting an item  -->
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Are you sure, you want to delete this item?</v-card-title>
            <v-card-text v-if="prod">{{ prod.name }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="dialog = false">No</v-btn>
              <v-btn color="green darken-1" flat @click="deleteProduct(prod)">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import db from "./fireconf";
import firebase from "firebase";

export default {
  data() {
    return {
      products: [],
      dialog: false,
      prod: null,
      feedback : null
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
              description: doc.data().description,
              images: doc.data().images,
              slug: doc.data().slug,
              qty: 1
            };

            this.products.push(data);
          });
        });
    },
    addItem: function(product) {
      this.$store.dispatch("addCartItem", product);
    },
    confirmation(product) {
      this.prod = product;
      this.dialog = true;
    },
    deleteProduct() {
      let prodRef = db.collection("products").doc(this.prod.id);
      prodRef.get().then(doc => {
        if (doc.exists) {
          let imageUrls = doc.data().images;
          imageUrls.forEach(url => {
            let imageRef = firebase.storage().refFromURL(url);
            imageRef.delete();
          });
          doc.ref.delete();
          this.$store.dispatch("deleteProduct", this.prod);
        }
      });
      this.dialog = false;
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    displayProducts() {
      return this.$store.state.products;
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

