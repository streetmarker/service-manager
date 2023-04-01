<template>
  <div>
    <v-text-field v-model="searchText" />
    <v-btn clearable @click="searchLocation">
      Search
    </v-btn> <br>
    {{ location.display_name }} <br>
    {{ location.lat }} <br>
    {{ location.lon }} <br>
    <v-alert v-if="errorMsg.length > 0" type="error">
      {{ errorMsg }}
    </v-alert>
  </div>
</template>

<script>

export default {
  name: 'ServiceManagerSearchLocation',

  data () {
    return {
      searchText: '',
      location: {
        display_name: '',
        lat: '',
        lon: ''
      },
      errorMsg: ''
    }
  },

  // mounted() {

  // },

  methods: {
    async searchLocation () {
      const encodedQuery = encodeURIComponent(this.searchText)
      const response = await this.$axios.get(`https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json`).then((res, err) => {
        try {
          return res
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      })
      const data = response.data[0]
      if (data) {
        this.location = data
        this.errorMsg = ''
      } else {
        this.errorMsg = 'Podaj szczegółowe dane'
      }
      //   } catch (error) {
      // eslint-disable-next-line no-console
    //   console.log(error)
    //   }
    //   Object.keys(response).length > 0 ? this.location = response : this.location.display_name = 'error'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
