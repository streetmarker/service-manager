<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card v-if="!$store.state.user.token.length>0" class="logo py-4 d-flex justify-center">
        <v-form @submit.prevent>
          <h1>Login</h1>
          <v-text-field
            v-model="login"
            :rules="rules"
            label="Login"
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
  data: () => ({
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

    logIn () {
      // przenieść do store
      this.errorMsg = ''
      this.successMsg = ''
      const userData = {
        login: this.login,
        password: this.password
      }
      try {
        this.fetchUser(this.login) // zapis do store
        this.fetchToken(userData) // init token w store
        setTimeout(() => {
          this.token = this.$store.state.user.token
          this.$store.state.user.token.length === 0
            ? (this.errorMsg = 'Wrong login or password')
            : (this.successMsg = 'Logged in')
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
    }
  }
}
</script>
<style></style>
