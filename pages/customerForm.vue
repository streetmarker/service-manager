<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <LoginComponent :class="{ 'hidden-component': currentComponent }" type="customer" />
        <RequestForm :class="{ 'hidden-component': !currentComponent }" />
        <!-- <transition-group name="fade" mode="out-in"> -->
        <!-- <component :is="currentComponent" :key="currentComponent" type="customer" /> -->
        <!-- </transition-group> -->
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
  components: { RequestForm, LoginComponent },
  data: () => ({
    showComponent: true
  }),
  computed: {
    currentComponent () {
      if (this.$store.state.customer.token.length === 0) {
        return false
        // return 'LoginComponent'
        // return 'RequestForm'
      } else {
        return true
        // return 'RequestForm'
      }
    }
  },
  methods: {
    hideOut () {
      this.showComponent = !this.showComponent
    }
  }
}

</script>
<style>
.hidden-component {
  display: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
