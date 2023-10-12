<template>
  <div>
    <LoginComponent :class="{ 'hidden-component': currentComponent }" />
    <MainGrid :class="{ 'hidden-component': !currentComponent }" />
    <br>
    <FaultsList :class="{ 'hidden-component': !currentComponent }" />
    <!-- <v-row v-if="$store.state.user.token.length == 0" justify="center" align="center">
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
        </v-col>
      </v-row>
    </div> -->
  </div>
</template>

<script>
// import messaging from '../plugins/firebase'
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
  },
  data: () => ({
    showComponent: true
  }),
  computed: {
    currentComponent () {
      if (this.$store.state.user.token.length === 0) {
        return false
        // return 'LoginComponent'
        // return 'RequestForm'
      } else {
        return true
        // return 'RequestForm'
      }
    }
  },
  mounted () {
    // console.log('M', messaging)
    //   const messaging = app.messaging()

    //   try {
    //     const token = await messaging.getToken()
    //     console.log('FCM Token:', token)
    //     // Send this token to your server to associate it with the user

  //     // Handle incoming messages when the app is in the foreground
  //     messaging.onMessage((payload) => {
  //       console.log('Message received:', payload)
  //     })
  //   } catch (error) {
  //     console.error('Error getting FCM token:', error)
  //   }
  },
  methods: {
    async requestNotificationPermission () {
      try {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          // Permission granted, you can now request the FCM token
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error)
      }
    },
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
