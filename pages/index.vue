<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        l
      </v-card>
      <br>
      <LoginComponent v-if="Object.keys($store.state.user.user).length == 0" />
      <SearchLocation />
    </v-col>
  </v-row>
</template>

<script>
import LoginComponent from '~/components/LoginComponent.vue'
import SearchLocation from '~/components/SearchLocation.vue'

export default {
  name: 'IndexPage',
  components: {
    LoginComponent,
    SearchLocation
  }
}
</script>
