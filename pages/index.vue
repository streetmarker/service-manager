<template>
  <div>
    <v-row v-if="Object.keys($store.state.user.user).length == 0" justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <LoginComponent />
        <br>
      </v-col>
    </v-row>
    <div v-else>
      <MainGrid />
      <br>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          <GetLocations />
          <SearchLocation />
          <br>
          <AddCustomer />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import LoginComponent from '~/components/LoginComponent.vue'
import SearchLocation from '~/components/SearchLocation.vue'
import MainGrid from '~/components/MainGrid.vue'
import GetLocations from '~/components/GetLocations.vue'
import AddCustomer from '~/components/AddCustomer.vue'

export default {
  name: 'IndexPage',
  components: {
    LoginComponent,
    SearchLocation,
    MainGrid,
    GetLocations,
    AddCustomer
  }
}
</script>
