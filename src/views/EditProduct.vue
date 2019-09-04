<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Edit a product</span>
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

        <v-container v-if="uploaded">
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
  created() {
      let ref = db.collection('products').where('slug','==', this.$route.params.product_slug)
      ref
      .get()
      .then(snapshot => {
          snapshot.forEach(doc => {
              this.product.imageUrls = doc.data().images
              this.product.name = doc.data().name
              this.product.stock = doc.data().stock
              this.product.description = doc.data().description
              this.product.price = doc.data().price
          })
      })
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
        } else {
          this.feedback = "Please upload atleast one image!"
        }
      }
    },
    uploadFiles() {
      if (this.files.length === 0){
        this.feedback = 'Please select at least one image to upload'
      } else {
        this.loading = true

        this.files.forEach(file => {
          this.upload(file);
        });

        setTimeout(() => {
          this.uploaded = true
          this.loading = false
        }, 2000)
      }
    },
    saveProduct() {
      let productRef = firebase.firestore().collection("products");
      this.slug = slugify(this.productName, {
        replacement: '-',
        remove: /[$*_+~.()'"!\-:@]/g,
        lower: true
      })
      productRef
        .add({
          name: this.productName,
          price: this.price,
          stock: this.quantity,
          description: this.description,
          category: this.category,
          images: this.imageUrls,
          slug: this.slug
        })
        .then(() => {
          this.feedback = null;
          this.imageUrls = []
          this.uploaded = false
          this.$refs.form.reset();
          document.getElementById("primaryimage").value = "";
        });
    },
    removeImage(imageUrl) {
      this.imageUrls = this.imageUrls.filter((value) => {
        return value != imageUrl;
      })
      if (this.imageUrls.length === 0){
        this.uploaded = false
        document.getElementById("primaryimage").value = "";
      }
    }
  }
};
</script>