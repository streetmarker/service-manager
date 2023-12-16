<!-- eslint-disable vue/v-slot-style -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <v-card>
      <v-banner
        color="secondary"
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
          <div>
            <v-col>
              <v-btn color="primary" @click="generateExcel()">
                <v-icon>mdi-microsoft-excel</v-icon>
              </v-btn>

              <v-btn color="primary" @click="getFaults()">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-col>
          </div>
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
            <v-menu offset-x top rounded="0">
              <template #activator="{ on, attrs }">
                <v-btn
                  x-small
                  depressed
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  @click="showActions(item)"
                >
                  <b>AKCJE</b>
                </v-btn>
              </template>
              <v-card style="max-width: 500px" flat>
                <!-- v-for="action in actions" :key="action.value" dense -->
                <v-list>
                  <v-list-item v-for="action in actions" :key="action.value" dense link @click="openAction(action, item)">
                    <v-list-item-title>{{ action.name }} </v-list-item-title>
                    <!-- <AddCommentModal :show="modal1" /> -->
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>
          <template v-slot:item.details="{ item }">
            <v-btn
              icon
              rounded
              link
              @click="openAction('faultDetails', item)"
            >
              <v-icon>mdi-information</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.date="{ item }">
            {{ item.date.slice(0, 19) }}
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
          <template v-slot:item.deadline="{ item }">
            <v-btn v-if="Math.floor((today - new Date(item.date)) / (1000 * 60 * 60 * 24)) > 0" color="error">
              {{ Math.floor((today - new Date(item.date)) / (1000 * 60 * 60 * 24)) }}
            </v-btn>
            <v-btn v-else color="success">
              {{ Math.floor((today - new Date(item.date)) / (1000 * 60 * 60 * 24)) }}
            </v-btn>
          </template>
          <!-- </v-data-table> -->
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination
            v-model="page"
            :length="pageCount"
          />
        </div>
      </v-card-text>
    </v-card>
    <!-- <FaultDetailsControl :show="modal" :fault="faultData" @open="handleModal" /> -->
    <!-- actions -->
    <FaultDetailsControl ref="faultDetails" />
    <AddCommentModal ref="addComment" />
    <CancelService ref="terminateProcess" />
    <ModifyService ref="changeOrderAttributes" />
    <ReassignService ref="orderAssignment" />
  </div>
</template>

<script>
import tableToXlsx from '../server/api/functions/tableToXlsx'
import FaultDetailsControl from './FaultDetailsControl'
import AddCommentModal from './actions/AddCommentModal.vue'
import CancelService from './actions/CancelService.vue'
import ModifyService from './actions/ModifyService.vue'
import ReassignService from './actions/ReassignService.vue'

export default {
  name: 'ServiceManagerFaultsList',
  components: { FaultDetailsControl, AddCommentModal, CancelService, ModifyService, ReassignService },

  data () {
    return {
      today: Date,
      modal: false,
      faultData: {},
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      faultsList: [],
      // modal1: false,
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
          text: 'Terminowość (D)',
          align: 'start',
          value: 'deadline'
        },
        {
          text: 'Miasto',
          align: 'start',
          value: 'city'
        }
      ],
      actions: [
        {
          name: 'Zmiana przypisania serwisanta',
          value: 'orderAssignment'
        },
        {
          name: 'Modyfikacja atrybutów zlecenia',
          value: 'changeOrderAttributes'
        },
        {
          name: 'Anulowanie zlecenia',
          value: 'terminateProcess'
        },
        {
          name: 'Dodanie komentarza',
          value: 'addComment'
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
    this.today = new Date()
    this.getFaults()
  },
  // watch: {
  //   modal () {
  //     this
  //   }
  // },
  methods: {
    showDetails (item) {
      this.faultData = Object.assign({}, item)
      this.modal = true
    },
    showActions (item) {
      console.log(item)
    },
    openAction (action, item) {
      if (action.value) {
        this.$refs[action.value]._data.fault = item
        this.$refs[action.value]._data.showIn = true
      } else {
        // console.log(action, item)
        this.$refs[action]._data.fault = item
        this.$refs[action]._data.showIn = true
      }
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
    // handleModal (value) {
    //   this.modal = value
    // },
    generateExcel () {
      tableToXlsx(this.faultsList, 'Lista Zleceń')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
