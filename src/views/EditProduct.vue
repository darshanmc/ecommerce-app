<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Edit a product</span>
      </v-card-title>

      <v-alert v-if="successMessage" :value="true" type="success">{{successMessage}}</v-alert>

      <v-form ref="form" lazy-validation>
        <v-card-text>
          <v-text-field label="Product Name" v-model="productName" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Category" v-model="category" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Price" v-model="price" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Quantity" v-model="stock" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Description" v-model="description" :rules="textFieldRules" required></v-text-field>
          <v-text-field label="Product Code" v-model="code" :rules="textFieldRules" required></v-text-field>
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

        <v-container>
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
          <v-btn
            color="blue darken-1"
            :disabled="disabled"
            :loading="isLoading"
            text
            @click="uploadFiles()"
          >
            Upload Images
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-actions>
          <v-btn :disabled="disableUpadate" color="blue darken-1" text @click="update()">Update</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";
import slugify from "slugify";
import db from "./fireconf";

export default {
  data() {
    return {
      productName: null,
      category: null,
      price: null,
      quantity: null,
      description: null,
      code: null,
      stock: null,
      files: [],
      fileNames: null,
      textFieldRules: [v => !!v || "This value is required"],
      feedback: null,
      imageUrls: [],
      newImageUrls: [],
      uploaded: false,
      loading: false,
      disabled: true,
      productId: null,
      deletedImages: [],
      successMessage: null
    };
  },
  computed: {
    disableUpadate() {
      if (this.imageUrls.length === 0 && this.newImageUrls.length === 0){
        return true;
      } else {
        return false;
      }
    },
    imageUploaded() {
      if (this.newImageUrls.length === 0) {
        return false;
      } else if (this.newImageUrls.length === this.files.length) {
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
  created() {
    let ref = db
      .collection("products")
      .where("slug", "==", this.$route.params.product_slug);
    ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.productId = doc.id;
        this.imageUrls = doc.data().images;
        this.productName = doc.data().name;
        this.stock = parseInt(doc.data().stock);
        this.category = doc.data().category;
        this.description = doc.data().description;
        this.price = doc.data().price;
        this.code = doc.data().code;
      });
    });
  },
  methods: {
    detectFiles(fileList) {
      this.disabled = false;
      Array.from(Array(fileList.length).keys()).map(x => {
        this.files.push(fileList[x]);
        if (this.fileNames) {
          this.fileNames = "," + fileList[x].name;
        } else {
          this.fileNames = fileList[x].name;
        }
      });
    },
    getProductName() {
      if (this.productName) {
        return this.productName;
      } else {
        return Math.random()
          .toString(10)
          .substr(2, 3);
      }
    },
    upload(file, path) {
      firebase
        .storage()
        .ref("products/" + path + "/" + file.name)
        .put(file)
        .then(uploadTask => {
          uploadTask.ref
            .getDownloadURL()
            .then(url => {
              this.imageUrls.push(url);
              this.newImageUrls.push(url);
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
    update() {
      if (this.imageUrls.length === 0 && this.files.length === 0) {
        this.feedback = "Upload at least one image of the product!";
      }

      if (
        this.productName &&
        this.category &&
        this.price &&
        this.description &&
        this.stock &&
        this.code
      ) {
        // Save product
        this.updateProduct();
      } else {
        this.$refs.form.validate();
      }
    },
    uploadFiles() {
      if (this.files.length === 0) {
        this.feedback = "Please select at least one image to upload";
      } else {
        this.loading = true;
        let path = this.getProductName();

        this.files.forEach(file => {
          this.upload(file, path);
        });
      }
    },
    updateProduct() {
      this.slug = slugify(this.productName, {
        replacement: "-",
        remove: /[$*_+~.()'"!\-:@]/g,
        lower: true
      });

      // update product
      db.collection("products")
        .doc(this.productId)
        .update({
          name: this.productName,
          price: this.price,
          stock: this.stock,
          description: this.description,
          category: this.category,
          images: this.imageUrls,
          slug: this.slug
        })
        .then(() => {
          // delete images from firebase
          this.removeImagesFromFirebase();

          // clear the files in the input
          document.getElementById("primaryimage").value = "";

          // send the success message
          this.successMessage = "Product updated!";
          
          // scroll to top of the page
          scrollTo(0,0);
        });
    },
    removeImagesFromFirebase() {
      if (this.deletedImages.length !== 0) {
        this.deletedImages.forEach(image => {
          firebase
            .storage()
            .refFromURL(image)
            .delete();
        });
        this.deletedImages = [];
      }
    },
    removeImage(imageUrl) {
      this.imageUrls = this.imageUrls.filter(value => {
        return value != imageUrl;
      });

      this.deletedImages.push(imageUrl);

      if (this.imageUrls.length === 0) {
        document.getElementById("primaryimage").value = "";
      }
    }
  }
};
</script>