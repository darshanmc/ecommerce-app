<template>
  <div>
    <h2>Cart page</h2>
      <ul>
          <li v-for="product in products" :key="product.id">
            {{ product.name }}
            <span> {{ product.price }} </span>
          </li>
          <li> Total : {{ cartTotal }}</li>
      </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  computed : {
    products () {
      return this.$store.state.productsInCart
    },
    cartTotal () {
      let total = 0;
      this.$store.state.productsInCart.forEach(product => {
        total += product.price;
      });
      return total;
    }
  }
};
</script>

<style>
</style>
