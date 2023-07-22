<!-- eslint-disable vue/v-slot-style -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <v-card>
      <v-banner
        color="indigo darken-3"
        rounded
        single-line
      >
        <v-card-title>
          Lista zleceń
          <v-spacer />
          <!-- <v-btn @click="getFaults">
            odświerz
            <v-icon>mdi-refresh</v-icon>
          </v-btn> -->
          <v-btn><v-icon>mdi-microsoft-excel</v-icon></v-btn>
        </v-card-title>
      </v-banner>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="faultsList"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1"
          sort-by="id"
          :sort-desc="true"
          @page-count="pageCount = $event"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              @click="showActions(item)"
            >
              <b>AKCJE</b>
            </v-btn>
          </template>
          <template v-slot:item.details="{ item }">
            <v-btn
              icon
              rounded
              @click="showDetails(item)"
            >
              <nuxt-link :to="'/faults/' + item.id">
                <v-icon>mdi-information</v-icon>
              </nuxt-link>
            </v-btn>
          </template>
          <template v-slot:item.isactive="{ item }">
            <div v-if="item.isactive">
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
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :length="pageCount"
          />
        </div>
      </v-card-text>
    </v-card>
    <FaultDetailsControl :show="modal" :fault="faultData" @open="handleModal" />
  </div>
</template>

<script>
import FaultDetailsControl from './FaultDetailsControl'

export default {
  name: 'ServiceManagerFaultsList',
  components: { FaultDetailsControl },

  data () {
    return {
      modal: false,
      faultData: {},
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      faultsList: [],
      headers: [
        {
          // text: '',
          align: 'start',
          sortable: false,
          value: 'actions'
        },
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
          text: 'Data realizacji',
          align: 'start',
          value: 'date'
        },
        {
          text: 'Przydzielona firma',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Przydzielony serwisant',
          align: 'start',
          value: 'login'
        },
        {
          text: 'Status ogólny',
          align: 'start',
          value: 'isactive'
        },
        {
          text: 'Miasto',
          align: 'start',
          value: 'city'
        }
      ]
    }
  },

  computed: {
    pages () {
      return Math.ceil(this.faultsList.length / this.itemsPerPage)
    }
  },

  mounted () {
    this.getFaults()
  },

  methods: {
    showDetails (item) {
      this.faultData = Object.assign({}, item)
      this.modal = true
      console.log(item)
    },
    showActions (item) {
      console.log(item)
    },
    async getFaults () {
      const response = await this.$axios.get('api/getFaults')
      console.log(response)
      try {
        this.faultsList = response.data.rows
        // if (this.headers.length === 0) {
        //   this.headers.push({
        //   // text: '',
        //     align: 'start',
        //     sortable: false,
        //     value: 'actions'
        //   },
        //   {
        //     text: 'Szczegóły',
        //     align: 'start',
        //     sortable: false,
        //     value: 'details'
        //   })
        //   response.data.fields.forEach((el) => {
        //     this.headers.push({ text: el.name, align: 'start', sortable: false, value: el.name })
        //   })
        // }
      } catch (err) {
        console.log(err)
      }
    },
    handleModal (value) {
      this.modal = value
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
