<template>
  <div>
    <LoginComponent :class="{ 'hidden-component': currentComponent }" />
    <MainGrid :class="{ 'hidden-component': !currentComponent }" />
    <br>
    <FaultsList :class="{ 'hidden-component': !currentComponent }" :faults="asyncFaults" />
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
// import axios from 'axios'
import LoginComponent from '~/components/LoginComponent.vue'
import FaultsList from '~/components/FaultsList.vue'
import MainGrid from '~/components/MainGrid.vue'
// import AddCustomer from '~/components/AddCustomer.vue'
// const utils = require('../utils/utils')

export default {
  name: 'IndexPage',
  components: {
    LoginComponent,
    FaultsList,
    MainGrid
    // AddCustomer
  },
  async asyncData (context) {
    const startTime = new Date().getTime()

    console.log('SSR Faults')
    try {
      const response = await context.$axios.get(context.env.NUXT_ENV_API_HOST + 'api/getFaults').then((value) => {
        const endTime = new Date().getTime()
        const executionTime = endTime - startTime
        console.log(executionTime, 'ms')
        return value
      })
      return { asyncFaults: response.data.rows }
    } catch (err) {
      console.log(err)
    }
    // utils.logger.info({
    //   label: 'test', // utils.getFileName(__filename),
    //   message: 'Czas wykonania SSR: ' + executionTime
    // })
  },
  data: () => ({
    showComponent: true,
    asyncFaults: []
  }),
  head () {
    // SEO
    return {
      title: 'faults-panel'
    }
  },
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
