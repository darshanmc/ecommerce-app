<template>
    <v-toolbar app>
      <v-toolbar-title>e-commerce</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
         <v-btn flat router to="/"> Home </v-btn>
         <v-btn flat router to="/about">  About </v-btn>
         <v-btn flat router to="products">  Products </v-btn> 
      </v-toolbar-items>
    </v-toolbar>
</template>


<script>
export default {

}
</script>

