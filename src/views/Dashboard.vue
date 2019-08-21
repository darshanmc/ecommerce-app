<template>
  <div>
    <v-tabs fixed-tabs>
      <v-tab @click="switchTabs()">Order Management</v-tab>
      <v-tab @click="switchTabs()">Product Management</v-tab>
    </v-tabs>

    <div v-if="ordersEnabled">
      <v-card flat>
        <v-card-text>Orders</v-card-text>
      </v-card>
    </div>

    <div v-if="productsEnabled">
      <v-card flat>
        <v-card-text>Product Management</v-card-text>
        <v-card-actions>
          <v-btn>New Product</v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-layout justify-center>
      <v-dialog v-model="newProductDialog" persistent max-width="600px">
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ordersEnabled: true,
      productsEnabled: false,
      newProductDialog: false
    };
  },
  methods: {
    switchTabs() {
      this.ordersEnabled = !this.ordersEnabled;
      this.productsEnabled = !this.productsEnabled;
    }
  }
};
</script>

<style>
</style>
