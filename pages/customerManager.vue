<template>
  <div>
    <v-select
      v-model="firm"
      label="Wybór podwykonawcy"
      :items="firms"
    />
    <v-card v-if="serviceman.length>0">
      <v-card-title>Lokalizacja firmy</v-card-title>
      <v-card-text>
        {{ serviceman[0].display_name }}
      </v-card-text>
    </v-card>
    <br>
    <v-data-table
      :headers="headers"
      :items="serviceman"
    />
    <br>
    <v-btn @click="getServiceman(firm)">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <AddSubcontractorControl :show="modal1" />
    <AddServicemanControl :show="modal2" :firm="firmData" />
    <v-row>
      <v-col>
        <v-btn color="primary" @click="modal1 = !modal1">
          Dodaj podwykonawcę
        </v-btn>
      </v-col>
      <div v-if="firm">
        <v-col>
          <v-btn color="primary" @click="modal2 = !modal2">
            Dodaj Serwisanta do firmy
          </v-btn>
        </v-col>
      </div>
    </v-row>
  </div>
</template>

<script>
import AddServicemanControl from '~/components/AddServicemanControl.vue'
import AddSubcontractorControl from '~/components/AddSubcontractorControl.vue'

export default {
  name: 'ServiceManagerSubcontractorManager',
  components: { AddSubcontractorControl, AddServicemanControl },
  data () {
    return {
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
      headers: [
        {
          text: 'Technician',
          align: 'start',
          sortable: false,
          value: 'login'
        },
        {
          text: 'Qualifications',
          align: 'start',
          sortable: false,
          value: 'qualifications'
        },
        {
          text: 'City',
          align: 'start',
          sortable: false,
          value: 'city'
        },
        {
          text: 'Email',
          align: 'start',
          sortable: false,
          value: 'email'
        }
      ]
    }
  },
  watch: {
    firm (val) {
      this.getServiceman(val)
      const firmObj = this.firmsNvp.filter(nvp => nvp.name === this.firm)
      this.firmData.id = firmObj[0].id
      this.firmData.name = val
    }
  },
  mounted () {
    this.getFirms()
  },
  methods: {
    async getServiceman (firmId) {
      const body = {
        firmId
      }
      // console.log(firmId)
      const response = await this.$axios.post('api/getServiceman', body)
      try {
        // console.log(response)
        this.serviceman = response.data.rows
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    },
    async getFirms () {
      const response = await this.$axios.get('api/getFirms')
      // console.log(response)
      const res = response.data.rows
      res.forEach((el) => {
        this.firmsNvp.push(el)
        this.firms.push(el.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
