<template>
  <div>
  
    <v-container>
        <h2>Home Page</h2>
    </v-container>

    <v-layout row>
      <v-flex xs12 sm2 offset-sm1>
        <v-card>
          
          <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="150px"></v-img>

          <v-card-title primary-title>
            <div>
              <div class="headline">Product A</div>
              <span class="grey--text">1,000 miles of wonder</span>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn icon large>
              <v-icon>add_shopping_cart</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {};
</script>
