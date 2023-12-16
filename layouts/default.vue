<template>
  <v-app>
    <!--  -->
    <v-app-bar v-if="$store.state.user.token.length == 0" :clipped-left="clipped" fixed app>
      {{ title }}
      <v-spacer />
      <v-btn
        v-if="$store.state.user.token.length > 0"
        rounded
        @click="logout"
      >
        {{ $store.state.user.user.firstname }} | Wyloguj się
      </v-btn>
    </v-app-bar>
    <!-- color="indigo darken-1 -->
    <v-app-bar
      v-else
      dark
      color="primary"
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <v-btn text to="/">
          {{ title }}
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="$store.state.user.token.length > 0"
        plain
        data-cy="logoff"
        @click="logout"
      >
        {{ $store.state.user.user.login }} | Wyloguj się
      </v-btn>
    </v-app-bar>
    <!--  -->
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="drawer" left temporary fixed>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} Service Panel</span>
      <!-- <v-spacer />
      <v-btn color="primary" to="/">
        P
      </v-btn>
      <v-spacer />
      <v-btn color="secondary" to="/customerForm">
        C
      </v-btn>
      <v-spacer />
      <v-btn color="accent" to="/mobileApp">
        M
      </v-btn> -->
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
// eslint-disable-next-line import/no-named-as-default
// import io from 'socket.io-client'

export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      // fixed: false,
      items: [
        {
          icon: 'mdi-circle',
          title: 'Service Panel',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Subcontractor Manager',
          to: '/subcontractorManager'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Customer Manager',
          to: '/customerManager'
        }
      ],
      login: {
        icon: 'mdi-account-circle-outline',
        title: 'Login',
        to: 'login'
      },
      miniVariant: false,
      right: true,
      title: 'Service Panel',
      title2: 'SM'
    }
  },
  mounted () {
    // const socket = io('http://localhost:3001') // Replace with your Socket.IO server URL
    // socket.on('new-data', (data) => {
    //   console.log('socket data in')
    //   const mess = []
    //   if (this.$store.state.user.token.length !== 0) {
    //     for (let i = 0; i < data.length; i++) {
    //       if (this.$store.state.user.user.id === data[i].id) {
    //         console.log('user slots notify', i, data[i])
    //         // for (let j = 0; j < data.reserved.length; j++) {
    //         mess.push(data[i])
    //         // }
    //       }
    //     }
    //     const hours = [0, 7, 9, 11, 13, 15, 17, 19]
    //     let out = ''
    //     console.log('mess', mess)
    //     mess.forEach((el) => {
    //       out += el.date.slice(0, 10) + ' ' + hours[el.reserved] + ':00,'
    //     })
    //     console.log(out)
    //     const notifTitle = 'Przypomnienie'
    //     const notifBody = 'Masz robotę: ' + out
    //     const notifImg = '/favicon.ico'
    //     const options = {
    //       body: notifBody,
    //       icon: notifImg
    //     }
    //     // eslint-disable-next-line no-new
    //     new Notification(notifTitle, options)
    //   }
    // })
  },
  methods: {
    ...mapActions('user', ['fetchUser', 'fetchToken', 'logoutAction']),

    logout () {
      this.logoutAction() // reset store
    }
  }
}
</script>
<style>
* {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
