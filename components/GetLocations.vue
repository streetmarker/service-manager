<template>
  <v-card>
    <v-card-text>
      <v-select
        label="Adresy w bazie danych"
        :items="selectLocations"
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ServiceManagerGetLocations',

  data () {
    return {
      locations: [{
        id: 0,
        display_name: '',
        lon: 0.0,
        lat: 0.0
      }],
      selectLocations: []
    }
  },
  mounted () {
    this.getLocations()
  },
  methods: {
    async getLocations () {
      const response = await this.$axios.get('api/getLocations').then((res, err) => {
        try {
          return res
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      })
      this.locations = response.data.rows
      this.locations.forEach((lo) => {
        this.selectLocations.push(lo.display_name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
