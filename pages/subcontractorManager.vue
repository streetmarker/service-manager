<template>
  <div>
    <v-select
      v-model="firm"
      label="Wybór podwykonawcy"
      :items="firms"
    />
    <v-data-table
      :headers="headers"
      :items="serviceman"
    />
    {{ serviceman }}
  </div>
</template>

<script>
export default {
  name: 'ServiceManagerSubcontractorManager',

  data () {
    return {
      firm: null,
      firms: [],
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
          text: 'Location',
          align: 'start',
          sortable: false,
          value: 'display_name'
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
        this.firms.push(el.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
