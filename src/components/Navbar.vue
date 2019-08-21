<template>
  <div>
    <v-toolbar app>
      <v-toolbar-title>e-commerce</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
          <template v-slot:activator="{ on }">
            <v-btn icon large v-on="on">
              <div>
                <v-badge left>
                  <template v-slot:badge v-if="items != 0">
                    <span>{{items}}</span>
                  </template>
                  <v-icon>shopping_cart</v-icon>
                </v-badge>
              </div>
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-tile v-if="items === 0">
                <v-list-tile-title>Cart is empty</v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-for="product in products" :key="product.id">
                <v-list-tile-action>
                  <v-btn icon v-on:click="removeItem(product)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-title>{{product.name}}</v-list-tile-title>
              </v-list-tile>
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="menu = false" router to="/carts">Checkout</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <!-- <v-btn flat router to="/">Home</v-btn> -->
        <v-btn v-if="!displayName" flat router to="/about">About</v-btn>
        <v-btn flat router to="/products">Products</v-btn>
        <v-btn v-if="displayName" flat>Hello {{ displayName }}</v-btn>
        <v-btn v-if="isAdmin" fab dark color="indigo" router to="/newproduct">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn v-if="!displayName" flat @click="dialog = true">Login or Signup</v-btn>
        <v-btn v-if="displayName" icon flat @click="logout()" color="red darken-1">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card v-if="signup">
          <v-card-title>
            <span class="headline">Signup</span>
            <v-spacer></v-spacer>
            <v-btn color="black darken-1" icon flat @click="cancel()">
              <v-icon>cancel</v-icon>
            </v-btn>
          </v-card-title>
          <v-container>
            <v-form ref="form" lazy-validation>
              <v-text-field v-model="firstName" label="First Name" :rules="firstNameRules" required></v-text-field>
              <v-text-field v-model="lastName" label="Last Name" :rules="lastNameRules" required></v-text-field>
              <v-text-field v-model="email" label="Email" :rules="emailRules" required></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" :rules="passwordRules" required></v-text-field>
              <v-alert v-if="feedback" :value="true" type="error">{{feedback}}</v-alert>
            </v-form>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" :disabled="disabled" @click="switchToLogin()">Login</v-btn>
            <v-btn :loading="signUpLoading" :disabled="disabled" color="blue darken-1" @click="signUp()">Signup</v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-if="login">
          <v-card-title>
            <span class="headline">Login</span>
            <v-spacer></v-spacer>
            <v-btn color="black darken-1" icon flat @click="cancel()">
              <v-icon>cancel</v-icon>
            </v-btn>
          </v-card-title>

          <v-container>
            <v-form ref="form" lazy-validation>
              <v-text-field v-model="email" label="Email" :rules="emailRules" required></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>
              <v-alert v-if="feedback" :value="true" type="error">{{feedback}}</v-alert>
            </v-form>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="loginLoading" :disabled="disabled" color="blue darken-1" @click="loginUser()">Login</v-btn>
            <v-btn color="blue darken-1" :disabled="disabled" @click="switchToSignUp()">Signup</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>


<script>
import firebase from "firebase";
import db from "../views/fireconf";

export default {
  data() {
    return {
      menu: false,
      dialog: false,
      signup: false,
      login: true,
      loginLoading: false,
      signUpLoading: false,
      disabled: false,
      firstName: "",
      firstNameRules: [v => !!v || "First Name is required"],
      lastName: "",
      lastNameRules: [v => !!v || "Last Name is required"],
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      email: "",
      emailRules: [v => !!v || "E-mail is required"],
      feedback: null,
      user: null
    };
  },
  created() {
    let usersRef = db.collection("users");
    firebase.auth().onAuthStateChanged(() => {
      this.user = firebase.auth().currentUser
      if (this.user) {
        usersRef
          .where("user_id", "==", this.user.uid)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              this.$store.dispatch("setDisplayName", doc.data().first_name);
              this.$store.dispatch("setRole", doc.data().role);
            });
          });
      }
    });
  },
  methods: {
    removeItem: function(product) {
      this.$store.dispatch("removeCartItem", product);
    },
    cancel() {
      this.dialog = false
      this.feedback = null
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
    switchToLogin() {
      this.login = true;
      this.signup = false;
    },
    switchToSignUp() {
      this.login = false;
      this.signup = true;
    },
    signUp() {
      if (this.email && this.password && this.firstName && this.lastName) {
        this.signUpLoading = true
        this.disabled = true
        let userRef = db.collection("users")
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            this.user = cred.user;
            userRef.add({
                first_name: this.firstName,
                last_name: this.lastName,
                user_id: cred.user.uid
            }).then(() => {
              this.$store.dispatch("setDisplayName", this.firstName)
              this.feedback = null
              this.dialog = false
              this.$refs.form.resetValidation();
              this.$refs.form.reset();
              this.signUpLoading = false
              this.disabled = false
            }).catch(err => {
              this.feedback = err.message
              this.dialog = true
              this.loginLoading = false
              this.disabled = false
            })
          })
          .catch((err) => {
            this.feedback = err.message
            this.dialog = true
            this.loginLoading = false
            this.disabled = false
          })   
      } else {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
        }
      }
    },
    loginUser() {
      if (this.email && this.password) {
        this.loginLoading = true
        this.disabled = true
        this.$refs.form.resetValidation();
        let usersRef = db.collection("users");

        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            this.user = cred.user;
            this.$refs.form.reset();
            this.dialog = false;
            this.feedback = null;
            this.$refs.form.reset();

            usersRef
              .where("user_id", "==", cred.user.uid)
              .get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  this.$store.dispatch("setDisplayName", doc.data().first_name);
                  let role = doc.data().role
                  if (role) {
                    this.$store.dispatch("setRole", role)
                  }
                  this.feedback = null
                  this.loginLoading = false
                  this.disabled = false
                });
              })
              .catch(err => {
                this.feedback = err.message
                this.loginLoading = false
                this.disabled = false
              })
          })
          .catch(err => {
            this.feedback = err.message;
            this.$refs.form.reset();
            this.loginLoading = false
            this.disabled = false
          });
      } else {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
        }
      }
    },
    logout() {
      firebase.auth().signOut();
      this.$store.dispatch("unsetDisplayName");
      this.$store.dispatch("unsetRole")
    }
  },
  computed: {
    items() {
      return this.$store.state.cartItem;
    },
    products() {
      return this.$store.state.productsInCart;
    },
    displayName() {
      return this.$store.state.displayName;
    }, 
    isAdmin() {
      let isAdmin = false;
      let role = this.$store.state.role;
      if (role === 'admin'){
        isAdmin = true
      }
      return isAdmin;
    }
  }
};
</script>

<style scoped>
</style>
