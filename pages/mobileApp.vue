<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Panel serwisanta</v-toolbar-title>
      <v-spacer />
      {{ $store.state.user.user.login }}
    </v-app-bar>
    <v-main>
      <v-container v-if="$store.state.user.token.length === 0">
        <LoginComponent type="svm" @logged="handleLogin" />
      </v-container>
      <v-container v-else>
        <v-card>
          <v-card-title>
            Welcome!
          </v-card-title>
          <v-card-text>
            Oddzielne logowanie dla serwisanta <br>
            Widoczność dla roli svm <br>
            Lista zleceń Serwisanta <br>
            Po kliknięciu w zlecenie szczegóły: klient, komentarze(możliwość dodania), możliwość zmiany statusu, możliwość szybkiego kontaktu z klientem
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="init">
              Click me!
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-card-title>
            Lista zleceń
            <v-spacer />
            <v-btn @click="getFaults">
              odświerz
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
        <v-data-table
          :headers="headers"
          :items="modifiedFaultsList"
        >
          <template #item.details="{ item }">
            <v-btn
              icon
              rounded
              @click="showDetails(item)"
            >
              <nuxt-link :to="'/faults/' + item.id">
                <v-icon>mdi-play</v-icon>
              </nuxt-link>
              <!-- <a href="/mobileFaultView"></a> -->
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
        <!-- </div> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LoginComponent from '~/components/LoginComponent.vue'

export default {
  components: { LoginComponent },
  data () {
    return {
      faultsList: [],
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
      hoursDict: [],
      modifiedFaultsList: [],
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
    showDetails (item) {
      console.log(item)
    },
    async getDictionaries () {
      try {
        const response = await this.$axios.get('api/getSlotHour')
        const res = response.data.rows
        this.hoursDict = res
        console.log('hours dict', this.hoursDict)
        console.log('lista faltów: ', this.faultsList)
        this.faultsList.forEach((el) => {
          const obj = this.hoursDict.find(obj => obj.id === el.slothour_id)
          el.hour = obj.value
        })
        const arr = this.faultsList.map(item => ({
          ...item,
          date: item.date.substring(0, 10) + ' (' + item.hour + ')',
          display_name: item.display_name.substring(0, 15) + '...'
        }))
        this.modifiedFaultsList = arr
      } catch (er) {
        console.log(er)
      }
    },
    getFaults () {
      setTimeout(async () => {
        const userId = await this.$store.state.user.user.svmid
        const body = {
          svmId: userId
        }
        console.log('body', body)
        const response = await this.$axios.post('api/getAssignedFaults', body)
        console.log('getFaults')
        try {
          this.faultsList = response.data.rows
        } catch (err) {
          console.log(err)
        }
        console.log('gF:', this.faultsList)
      }, 200)
    },
    init () {
      try {
        setTimeout(() => {
          this.getDictionaries()
        }, 500)
        this.getFaults()
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
