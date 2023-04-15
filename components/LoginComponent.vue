<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card v-if="!$store.state.user.token.length>0" class="logo py-4 d-flex justify-center">
        <v-form @submit.prevent>
          <h1 v-if="type === 'user'">
            Staff Login
          </h1>
          <h1 v-if="type === 'customer'">
            Client Login
          </h1>
          <v-text-field
            v-if="type === 'user'"
            v-model="login"
            :rules="rules"
            label="Login"
          />
          <v-text-field
            v-else-if="type === 'customer'"
            v-model="customerId"
            :rules="rules"
            label="ID"
          />
          <v-text-field
            v-model="password"
            type="password"
            :rules="rules"
            label="Password"
          />
          <br>
          <v-btn
            type="submit"
            block
            class="mt-2"
            @click="logIn"
          >
            Log In
          </v-btn>
        </v-form>
      </v-card>
      <v-alert v-if="errorMsg" type="error">
        {{ errorMsg }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'IndexPage',
  props: {
    type: {
      type: String,
      default: 'user'
    }
  },
  data: () => ({
    customerId: null,
    login: 'admin', // test
    password: 'admin', // test
    rules: [
      (value) => {
        if (value) { return true }

        return 'Required'
      }
    ],
    token: '',
    recipes: [],
    errorMsg: '',
    successMsg: ''
  }),
  head () {
    // SEO
    return {
      title: 'login'
    }
  },
  methods: {
    ...mapActions('user', ['fetchUser', 'fetchToken', 'logoutAction']),
    ...mapActions('customer', ['fetchCustomer', 'fetchTokenCustomer', 'logoutActionCustomer']),

    logIn () {
      // przenieść do store
      this.errorMsg = ''
      this.successMsg = ''
      let ident = null
      if (this.type === 'user') {
        ident = this.login
      } else if (this.type === 'customer') {
        ident = Number(this.customerId)
      }
      const userData = {
        ident,
        password: this.password
      }
      try {
        if (this.type === 'user') {
          this.fetchUser(this.login) // zapis do store
          this.fetchToken(userData) // init token w store
        } else if (this.type === 'customer') {
          this.fetchCustomer(this.customerId) // zapis do store
          this.fetchTokenCustomer(userData) // init token w store
        }
        setTimeout(() => {
          if (this.type === 'user') {
            this.token = this.$store.state.user.token
            this.$store.state.user.token.length === 0
              ? (this.errorMsg = 'Wrong login or password')
              : (this.successMsg = 'Logged in')
          } else if (this.type === 'customer') {
            this.token = this.$store.state.customer.token
            this.$store.state.customer.token.length === 0
              ? (this.errorMsg = 'Wrong login or password')
              : (this.successMsg = 'Logged in')
          }
        }, 500)
      } catch (err) {
        this.errorMsg = err
        // eslint-disable-next-line no-console
        console.log(err)
      }
    },
    logout () {
      // this.token = ''
      // this.successMsg = ''
      this.logoutAction() // reset store
      this.logoutActionCustomer() // reset store
    }
  }
}
</script>
<style></style>
