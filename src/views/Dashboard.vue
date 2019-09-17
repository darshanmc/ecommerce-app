<template>
  <div>
    <div class="header">
      <h1>Orders</h1>
    </div>
    <br />
    <div v-if="displayMessage" class="header">
      <h1>No orders yet!</h1>
    </div>
    <v-expansion-panel>
      <v-expansion-panel-content v-for="(order, index) in orders" :key="index">
        <template v-slot:actions>
          <v-icon :color="order.status">highlight</v-icon>
          <v-icon color="primary">$vuetify.icons.expand</v-icon>
        </template>
        <template v-slot:header>
          <div class="header">
            <h3>Order Number - {{ order.orderId }}</h3>
          </div>
        </template>
        <br />
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
            <br />
            <div>
              <v-btn
                @click="completeOrder(order.orderId)"
                :disabled="disable(order.status)"
                :loading="completeLoading"
                large
                color="success"
              >Complete</v-btn>
              <v-btn
                @click="rejectOrder(order.orderId)"
                :disabled="disable(order.status)"
                :loading="rejectLoading"
                large
                color="error"
              >Cancel</v-btn>
            </div>
          </v-flex>

          <v-spacer></v-spacer>

          <v-flex md7>
            <v-card max-width="700px">
              <v-card-text>
                <v-list>
                  <v-list-tile v-for="(product,index) in order.products" :key="index" avatar>
                    <v-list-tile-avatar>
                      <img :src="product.images[0]" />
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title v-html="product.name"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="product.code"></v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile>₹{{product.price}}</v-list-tile>

                    <v-list-tile-action>{{ product.qty }}</v-list-tile-action>

                    <v-list-tile>₹{{product.price * product.qty}}</v-list-tile>
                  </v-list-tile>
                  <br />
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-spacer></v-spacer>
                    <h3>Cart Total: ₹{{ getOrderTotal(order.products) }}</h3>
                  </v-list-tile>
                </v-list>
              </v-card-text>
            </v-card>
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
    getOrderTotal(products) {
      let orderTotal = 0;
      products.forEach(product => {
        orderTotal += parseFloat(product.price);
      });
      return orderTotal;
    },
    completeOrder(orderId) {
      // update db
      this.completeLoading = true;
      db.collection("order")
        .where("order_id", "==", orderId)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            doc.ref
              .update({
                status: "green"
              })
              .then(() => {
                let index = this.orders.findIndex(
                  order => order.orderId === orderId
                );
                this.orders[index].status = "green";
                this.completeLoading = false;
              });
          });
        });
    },
    rejectOrder(orderId) {
      this.rejectLoading = true;
      db.collection("order")
        .where("order_id", "==", orderId)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            doc.ref
              .update({
                status: "red"
              })
              .then(() => {
                let index = this.orders.findIndex(
                  order => order.orderId === orderId
                );
                this.orders[index].status = "red";
                this.rejectLoading = false;
              });
          });
        });
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
        .then(() => this.$store.dispatch("loadOrders", this.orders));
    }
  },
  computed : {
    displayMessage () {
      return this.orders.length === 0;
    }
  }
};
</script>

<style>
.header h1 {
  text-align: center;
  align-self: center;
  margin-top: 20px;
}

.header h3 {
  text-align: center;
  align-self: center;
}
</style>
