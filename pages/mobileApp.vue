<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-app>
    <!-- <v-app-bar app>
      <v-toolbar-title>Panel serwisanta</v-toolbar-title>
      <v-spacer />
      {{ $store.state.user.user.login }}
    </v-app-bar> -->
    <v-container v-if="$store.state.user.token.length === 0">
      <LoginComponent type="svm" @logged="handleLogin" />
    </v-container>
    <v-container v-else>
      <v-card>
        <v-card-title>
          Lista zleceń
          <v-spacer />
          <v-btn @click="init">
            odświerz
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
      <v-data-table
        :headers="headers"
        :items="$store.state.user.faultsList"
      >
        <template #item.details="{ item }">
          <v-btn
            icon
            rounded
          >
            <nuxt-link :to="'/faults/' + item.id">
              <v-icon>mdi-play</v-icon>
            </nuxt-link>
          </v-btn>
        </template>
        <template #item.isactive="{ item }">
          <div v-if="!!item">
            <v-chip color="success" outlined>
              AKTYWNA
            </v-chip>
          </div>
          <div v-else>
            <v-chip rounded color="error" outlined>
              ZAKOŃCZONA
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-container>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import LoginComponent from '~/components/LoginComponent.vue'

export default {
  components: { LoginComponent },
  data () {
    return {
      headers: [
        {
          text: 'Działania',
          align: 'start',
          sortable: false,
          value: 'details'
        },
        {
          text: 'Data i slot',
          align: 'start',
          value: 'date'
        },
        {
          text: 'Adres',
          align: 'start',
          value: 'display_name'
        }
      ],
      logged: false
    }
  },
  watch: {
    logged () {
      this.init()
      console.log('logged')
    }
  },
  methods: {
    ...mapActions('user', ['fetchFaultsList']),
    init () {
      try {
        setTimeout(async () => {
          const userId = await this.$store.state.user.user.svmid
          this.fetchFaultsList(userId)
        }, 500)
      } catch (error) {
        console.error(error)
      }
    },

    handleLogin (value) {
      this.logged = value
    }
  }
}
</script>
