<template>
  <v-container>
    <v-layout>
      <v-flex>
        <h2>Shipping Address</h2>
        <br />
        <v-card max-width="600px">
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="name" :value="name" :rules="textFieldRules" label="Name"></v-text-field>
              <v-text-field v-model="address1" :value="address1" :rules="textFieldRules" label="Address Line 1"></v-text-field>
              <v-text-field v-model="address2" :value="address2" label="Address Line 2"></v-text-field>
              <v-text-field v-model="landmark" :value="landmark" :rules="textFieldRules" label="Landmark"></v-text-field>
              <v-text-field v-model="city" :value="city" :rules="textFieldRules" label="City"></v-text-field>
              <v-text-field v-model="state" :value="state" :rules="textFieldRules" label="State"></v-text-field>
              <v-text-field v-model="pincode" :value="pincode" :rules="textFieldRules" label="Pincode" mask="######"></v-text-field>
              <v-text-field
                v-model="mobile"
                :rules="textFieldRules"
                label="Mobile"
                mask="##########"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn large color="green" @click="proceed()">Proceed</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Checkout",
  data() {
    return {
      textFieldRules: [v => !!v || "This value is required"],
      name: '',
      address1: '',
      address2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      mobile: ''
    };
  },
  methods: {
    proceed() {
      if (
        this.name &&
        this.address1 &&
        this.landmark &&
        this.city &&
        this.state &&
        this.pincode &&
        this.mobile
      ) {
        this.$store.dispatch("addShippingAddress", {
          name: this.name,
          address1: this.address1,
          address2: this.address2,
          landmark: this.landmark,
          city: this.city,
          state: this.state,
          pincode: this.pincode,
          mobile: this.mobile
        });
        this.$refs.form.reset();
        this.$router.push({ name: "ordersummary" });
      } else {
        this.$refs.form.validate();
      }
    }
  },
  created() {
      var address = this.$store.state.address;
      
      if (Object.keys(address).length !== 0) {
          this.name = address.name;
          this.address1 = address.address1;
          this.address2 = address.address2;
          this.landmark = address.landmark;
          this.city = address.city;
          this.state = address.state;
          this.pincode = address.pincode;
          this.mobile = address.mobile;
      }
  }
};
</script>