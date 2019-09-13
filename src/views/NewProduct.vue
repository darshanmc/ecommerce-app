<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Add a Product</span>
      </v-card-title>

      <v-form ref="form" lazy-validation>
        <v-card-text>
          <v-text-field label="Product Name" v-model="productName" :rules="textFieldRules" required></v-text-field>
          <v-select
            :items="categories"
            v-model="category"
            item-text="cat"
            item-value="abbr"
            label="Category"
          ></v-select>
          <v-text-field
            label="Price"
            v-model="price"
            :rules="textFieldRules"
            required
            mask="######"
          ></v-text-field>
          <v-text-field
            label="Quantity"
            v-model="quantity"
            :rules="textFieldRules"
            required
            mask="##"
          ></v-text-field>
          <v-text-field
            label="Product Code"
            v-model="code"
            :rules="textFieldRules"
            required
          ></v-text-field>
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

        <v-container v-if="imageUploaded">
          <v-layout row wrap>
            <v-flex md2 sm2 xs3 v-for="(img, index) in imageUrls" :key="index">
              <v-img :src="img">
                <v-btn fab small @click="removeImage(img)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-img>
            </v-flex>
          </v-layout>
        </v-container>

        <v-card-actions>
          <v-btn color="blue darken-1" :disabled="imageUploaded" :loading="isLoading" text @click="uploadFiles()">
            Upload Images
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-actions>
          <v-btn :disabled="!imageUploaded" color="blue darken-1" text @click="save()">Save</v-btn>
          <v-btn @click="clear()">Clear</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase/app";
import 'firebase/storage';
import slugify from "slugify";

export default {
  data() {
    return {
      productName: null,
      category: { cat: "Saree", abbr: "saree" },
      price: null,
      quantity: null,
      description: null,
      code: null,
      slug: null,
      files: [],
      fileNames: null,
      textFieldRules: [v => !!v || "This value is required"],
      feedback: null,
      imageUrls: [],
      loading: false,
      categories: [{ cat: "Saree", abbr: "saree" }]
    };
  },
  computed: {
    imageUploaded() {
      if (this.imageUrls.length === 0) {
        return false;
      } else if (this.imageUrls.length === this.files.length) {
        return true;
      } else {
        return false;
      }
    },
    isLoading() {
      if (!this.loading) {
        return this.loading;
      } else {
        if (this.imageUploaded) {
          return false;
        }
        return this.loading;
      }
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
        !this.quantity ||
        !this.code
      ) {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
        }
      } else {
        if (this.imageUrls.length === this.files.length) {
          // Save product
          this.saveProduct();
        } else {
          this.feedback = "Please upload atleast one image!";
        }
      }
    },
    uploadFiles() {
      if (this.files.length === 0) {
        this.feedback = "Please select at least one image to upload";
      } else {
        this.loading = true;
        this.files.forEach(file => {
          this.upload(file);
        });
      }
    },
    saveProduct() {
      let productRef = firebase.firestore().collection("products");
      this.slug = slugify(this.productName, {
        replacement: "-",
        remove: /[$*_+~.()'"!\-:@]/g,
        lower: true
      });
      
      var product = {};
      product.name = this.productName;
      product.price = this.price;
      product.stock = this.quantity;
      product.description = this.description;
      product.category = this.category.abbr;
      product.images = this.imageUrls;
      product.slug = this.slug;
      product.code = this.code;

      productRef
        .add(product)
        .then((doc) => {
          product.id = doc.id;
          this.$store.dispatch("addNewProduct", product);
          this.feedback = null;
          this.imageUrls = [];
          this.loading = false;
          this.$refs.form.reset();
          document.getElementById("primaryimage").value = "";
        });
    },
    removeImage(imageUrl) {
      this.imageUrls = this.imageUrls.filter(value => {
        return value != imageUrl;
      });
      this.files.pop();

      if (this.imageUrls.length === 0) {
        this.uploaded = false;
        document.getElementById("primaryimage").value = "";
      }
    },
    clear() {
      this.feedback = null;
      this.imageUrls = [];
      this.files = [];
      this.loading = false;
      this.$refs.form.reset();
      document.getElementById("primaryimage").value = "";
    }
  }
};
</script>

<style>
</style>
