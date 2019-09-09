<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title>
            <h2>Thank you for placing order with us. </h2>
          </v-card-title>
          <v-card-text>
              <h2>Your order number is : {{ orderNumber }} </h2>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    orderNumber() {
      return this.$store.state.orderNumber;
    }
  }
};
</script>s