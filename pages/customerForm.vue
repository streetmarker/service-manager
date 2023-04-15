<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <LoginComponent v-if="Object.keys($store.state.customer.customer).length == 0" type="customer" />
        <RequestForm v-else />
        <br>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LoginComponent from '~/components/LoginComponent.vue'
import RequestForm from '~/components/RequestForm.vue'

export default {
  name: 'CustomerForm',
  components: { RequestForm, LoginComponent }
}
</script>
