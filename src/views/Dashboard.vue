<template>
  <div>
    <v-card flat>
      <v-card-title>
        <h2>Orders</h2>
      </v-card-title>
    </v-card>
    <br />
    <v-expansion-panel>
      <v-expansion-panel-content v-for="(order, index) in orders" :key="index">
        <template v-slot:actions>
          <v-icon :color="order.status">highlight</v-icon>
          <v-icon color="primary">$vuetify.icons.expand</v-icon>
        </template>
        <template v-slot:header>
          <div>
            <h3>Order Number: {{ order.orderId }}</h3>
          </div>
        </template>
        <v-layout row>
          <v-spacer></v-spacer>
          <v-flex md3>
            <v-card elevation="2">
              <v-card-title>
                <u>
                  <h3>Shipping Address:</h3>
                </u>
              </v-card-title>
              <v-card-text>
                <p>
                  {{ order.address.name }}
                  <br />
                  {{ order.address.address1 }}
                  <br />
                  {{ order.address.address2 }}
                  <br />
                  {{ order.address.landmark }}
                  <br />
                  {{ order.address.city }}
                  <br />
                  {{ order.address.state }}
                  <br />
                  {{ order.address.pincode }}
                  <br />
                  {{ order.address.mobile }}
                </p>
              </v-card-text>
            </v-card>
            <br>
            <div>
              <v-btn @click="completeOrder(order.orderId)" :disabled="disable(order.status)" :loading="completeLoading" large color="success">Complete</v-btn>
              <v-btn @click="rejectOrder(order.orderId)" :disabled="disable(order.status)" :loading="rejectLoading" large color="error">Cancel</v-btn>
            </div>
          </v-flex>
          
          <v-spacer></v-spacer>

          <v-flex md7>
            <div v-for="(product, index) in order.products" :key="index">
              <v-card max-width="500px" elevation="2">
                <v-card-title>
                  <h3> {{ product.name }} </h3> 
                </v-card-title>
                
                <div>
                  <v-img :src="product.images[0]" max-height="300px"></v-img>
                </div>
                
                <v-card-text>
                  <u> Description:</u>  
                  {{ product.description }}
                </v-card-text>
                <v-card-text>
                  <u> Quantity:</u> 
                  {{ product.qty }}
                </v-card-text>
                <v-card-text> 
                  <u> Price:</u>
                  ₹{{ product.price }}
                </v-card-text>
              </v-card>
              <br>
            </div>
          </v-flex>

        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import db from "./fireconf";

export default {
  data() {
    return {
      orders: [],
      completeLoading: false,
      rejectLoading: false
    };
  },
  methods: {
    disable(status) {
      if (status === "yellow") {
        return false;
      } else {
        return true;
      }
    },
    completeOrder(orderId){
      // update db
      this.completeLoading = true;
      db.collection("order").where("order_id", "==", orderId).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.update({
            status : "green"
          })
          .then(() => {
            let index = this.orders.findIndex(order => order.orderId === orderId);
            this.orders[index].status = "green";
            this.completeLoading = false;
          })
        })
      })
    },
    rejectOrder(orderId){
      this.rejectLoading = true;
      db.collection("order").where("order_id", "==", orderId).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.update({
            status : "red"
          })
          .then(() => {
            let index = this.orders.findIndex(order => order.orderId === orderId);
            this.orders[index].status = "red";
            this.rejectLoading = false;
          })
        })
      })
    }
  },
  created() {
    this.orders = this.$store.state.orders;
    
    if (this.orders.length === 0) {
      db.collection("order")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.orders.push({
            address: doc.data().address,
            orderId: doc.data().order_id,
            products: doc.data().products,
            userId: doc.data().user_id,
            status: doc.data().status
          });
        });
      })
      .then(() => this.$state.dispatch("loadOrders", this.orders)); 
    }
  }
};
</script>

<style>
</style>
