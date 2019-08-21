<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Add new product</span>
      </v-card-title>

      <v-form ref="form" lazy-validation>
        <v-card-text>
          <v-text-field label="Product Name" v-model="productName" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Category" v-model="category" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Price" v-model="price" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Quantity" v-model="quantity" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Description" v-model="description" :rules="textFieldRules" required></v-text-field>
          <label for="primaryimage">Images</label>
          <input
            type="file"
            id="primaryimage"
            multiple
            accept="images/*"
            @change="detectFiles($event.target.files)"
          />
          <br />
          <v-alert v-if="feedback" :value="true" type="error">{{feedback}}</v-alert>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue darken-1" :loading="isLoading" text @click="uploadFiles()">
            Upload Images
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </v-card-actions>
        
        <v-card-actions>
          <v-btn :disabled="!imageUploaded" color="blue darken-1" text @click="save()">Save</v-btn>
        </v-card-actions>

      </v-form>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      productName: null,
      category: null,
      price: null,
      quantity: null,
      description: null,
      files: [],
      fileNames: null,
      textFieldRules: [v => !!v || "This value is required"],
      feedback: null,
      imageUrls: [],
      uploaded: false,
      loading: false
    };
  },
  computed : {
    imageUploaded ()  {
      return this.uploaded
    },
    isLoading() {
      return this.loading
    } 
  },
  methods: {
    detectFiles(fileList) {
      Array.from(Array(fileList.length).keys()).map(x => {
        this.files.push(fileList[x]);
        if (this.fileNames) {
          this.fileNames = "," + fileList[x].name;
        } else {
          this.fileNames = fileList[x].name;
        }
      });
    },
    upload(file) {
      firebase
        .storage()
        .ref("products/" + file.name)
        .put(file)
        .then(uploadTask => {
          uploadTask.ref
            .getDownloadURL()
            .then(url => {
              this.imageUrls.push(url);
              this.feedback = null;
            })
            .catch(err => {
              this.feedback = err.message;
            });
        })
        .catch(err => {
          this.feedback = err.message;
        });
    },
    save() {
      if (
        !this.productName ||
        !this.category ||
        !this.price ||
        !this.description ||
        !this.quantity
      ) {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
        }
      } else {
        if (this.imageUrls.length === this.files.length) {
          // Save product
          this.saveProduct()
          this.feedback = null
          this.imageUrls = []
          this.$refs.form.reset();
          document.getElementById("primaryimage").value = "";
        } else {
          this.feedback = "Please upload atleast one image!"
        }
      }
    },
    uploadFiles() {
      this.loading = true

      this.files.forEach(file => {
        this.upload(file);
      });

      setTimeout(() => {
        this.uploaded = true
        this.loading = false
      }, 2000)
    },
    saveProduct() {
      let productRef = firebase.firestore().collection("products");
      productRef
        .add({
          name: this.productName,
          price: this.price,
          stock: this.quantity,
          description: this.description,
          category: this.category,
          images: this.imageUrls
        })
        .then(() => {
          this.feedback = null;
        });
    }
  }
};
</script>

<style>
</style>
