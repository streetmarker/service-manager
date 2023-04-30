<template>
  <div>
    <v-row v-if="$store.state.user.token.length == 0" justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <LoginComponent />
        <br>
      </v-col>
    </v-row>
    <div v-else>
      <MainGrid />
      <br>
      <FaultsList />
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
          <br>
          <!-- <AddCustomer /> -->
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import LoginComponent from '~/components/LoginComponent.vue'
import FaultsList from '~/components/FaultsList.vue'
import MainGrid from '~/components/MainGrid.vue'
// import AddCustomer from '~/components/AddCustomer.vue'

export default {
  name: 'IndexPage',
  components: {
    LoginComponent,
    FaultsList,
    MainGrid
    // AddCustomer
  }
}
</script>
