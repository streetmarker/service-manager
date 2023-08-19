<template>
  <div>
    <!-- <v-col> -->
    <v-card>
      <v-card-title>
        <v-btn color="primary" @click="modal1 = !modal1">
          Dodaj klienta
        </v-btn>
        <v-spacer />
        <v-btn @click="getCustomers()">
          odświerz
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
    <br>
    <!-- </v-col> -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="customers"
      />
    </v-card>
    <br>
    <v-row>
      <AddCustomerControl :show="modal1" />
    </v-row>
  </div>
</template>

<script>
import AddCustomerControl from './../components/AddCustomerControl.vue'

export default {
  name: 'ServiceManagerCustomerManager',
  components: { AddCustomerControl },
  data () {
    return {
      customers: [],
      firmData: {
        id: 0,
        name: ''
      },
      modal1: false,
      modal2: false,
      firm: null,
      firms: [],
      firmsNvp: [],
      serviceman: [],
      headers: []
    }
  },
  watch: {
  },
  mounted () {
    this.getCustomers()
  },
  methods: {
    async getCustomers () {
      const response = await this.$axios.get('api/getCustomers')
      try {
        console.log(response)
        this.customers = response.data.rows
        if (this.headers.length === 0) {
          response.data.fields.forEach((el) => {
            if (el.name !== 'password') { this.headers.push({ text: el.name, value: el.name }) }
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
