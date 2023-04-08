<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <div v-if="Object.keys($store.state.user.user).length == 0">
          <LoginComponent />
          <br>
        </div>
        <div v-else>
          <GetLocations />
          <SearchLocation />
          <br>
        </div>
      </v-col>
    </v-row>
    <MainGrid />
  </div>
</template>

<script>
import LoginComponent from '~/components/LoginComponent.vue'
import SearchLocation from '~/components/SearchLocation.vue'
import MainGrid from '~/components/MainGrid.vue'
import GetLocations from '~/components/GetLocations.vue'

export default {
  name: 'IndexPage',
  components: {
    LoginComponent,
    SearchLocation,
    MainGrid,
    GetLocations
  }
}
</script>
