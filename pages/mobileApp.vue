<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Panel serwisanta</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <a href="/mobileFaultView">link</a>
      <v-container v-if="Object.keys($store.state.user.user).length == 0">
        <LoginComponent type="svm" />
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
            <v-btn color="primary" @click="buttonClicked">
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
          :items="faultsList"
        >
          <template #item.details="{ item }">
            <v-btn
              icon
              rounded
              @click="showDetails(item)"
            >
              <v-icon>mdi-information</v-icon>
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
        // comments
        // customer_id
        // description
        // faultstatus_id
        // faulttype_id
        // id
        // isactive
        // requestdate
        // slothour_id
        // timeslot_id
        {
          text: 'Szczegóły',
          align: 'start',
          sortable: false,
          value: 'details'
        },
        {
          text: 'Id zlecenia',
          align: 'start',
          // sortable: false,
          value: 'id'
        },
        {
          text: 'Data zgłoszenia',
          align: 'start',
          value: 'requestdate'
        },
        {
          text: 'Status ogólny',
          align: 'start',
          value: 'isactive'
        }
      ]
    }
  },
  mounted () {
    this.getFaults()
  },

  methods: {
    showDetails (item) {
      console.log(item)
    },
    async getFaults () {
      const response = await this.$axios.get('api/getFaults')
      console.log(response)
      try {
        this.faultsList = response.data.rows
      } catch (err) {
        console.log(err)
      }
    },
    buttonClicked () {
      alert('Button clicked!')
    }
  }
}
</script>
