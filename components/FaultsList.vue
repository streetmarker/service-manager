<!-- eslint-disable vue/v-slot-style -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
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
      <template v-slot:item.details="{ item }">
        <v-btn
          icon
          rounded
          @click="showDetails(item)"
        >
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.isactive="{ item }">
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
    <v-pagination v-model="page" :length="pages" @input="updatePage" />
  </div>
</template>

<script>
export default {
  name: 'ServiceManagerFaultsList',

  data () {
    return {
      page: 1,
      itemsPerPage: 5,
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
          text: 'Data realizacji',
          align: 'start',
          value: 'date'
        },
        {
          text: 'Status ogólny',
          align: 'start',
          value: 'isactive'
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
    updatePage (page) {
      this.page = page
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
