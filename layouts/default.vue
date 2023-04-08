<template>
  <v-app dark>
    <!-- v-if="Object.keys($store.state.user.user).length == 0" -->
    <v-app-bar v-if="Object.keys($store.state.user.user).length == 0" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <v-btn to="/">
          {{ title }}
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <!-- <v-btn
        v-if="!$store.state.user.token.length > 0"
        :to="login.to"
        plain
      >
        <v-icon>{{ login.icon }}</v-icon>{{ login.title }}
      </v-btn> -->
      <!-- <v-btn
        v-if="$store.state.user.token.length > 0"
        to="/userPanel"
        plain
      >
        <v-icon>{{ login.icon }}</v-icon>Moje konto
      </v-btn> -->
      <v-btn
        v-if="$store.state.user.token.length > 0"
        plain
        @click="logout"
      >
        {{ $store.state.user.user.firstname }} | Wyloguj się
      </v-btn>
    </v-app-bar>
    <v-app-bar v-else color="primary" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <v-btn to="/">
          {{ title }}
        </v-btn>
      </v-toolbar-title>
      <v-spacer />
      <!-- <v-btn
        v-if="!$store.state.user.token.length > 0"
        :to="login.to"
        plain
      >
        <v-icon>{{ login.icon }}</v-icon>{{ login.title }}
      </v-btn> -->
      <!-- <v-btn
        v-if="$store.state.user.token.length > 0"
        to="/userPanel"
        plain
      >
        <v-icon>{{ login.icon }}</v-icon>Moje konto
      </v-btn> -->
      <v-btn
        v-if="$store.state.user.token.length > 0"
        plain
        @click="logout"
      >
        {{ $store.state.user.user.login }} | Wyloguj się
      </v-btn>
    </v-app-bar>
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
    <v-footer :absolute="!fixed" app>
      <span>{{ new Date().getFullYear() }} &copy; Service Panel</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-search',
          title: 'Service Panel',
          to: '/'
        }
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'Inspire',
        //   to: '/inspire',
        // },
      ],
      login: {
        icon: 'mdi-account-circle-outline',
        title: 'Login',
        to: 'login'
      },
      miniVariant: false,
      right: true,
      title: 'Service Panel'
    }
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
