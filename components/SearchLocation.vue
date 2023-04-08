<template>
  <v-card>
    <v-card-title>Wyszukaj adres</v-card-title>
    <v-card-text>
      <v-text-field v-model="searchText" clearable label="Adres" />
      {{ location.display_name }} <br>
      <!-- {{ location.lat }} <br>
      {{ location.lon }} <br> -->
      <v-alert v-if="errorMsg.length > 0" type="error">
        {{ errorMsg }}
      </v-alert>
      <v-alert v-if="info.length > 0" type="success">
        {{ info }}
      </v-alert>
      {{ tmp }} km
    </v-card-text>
    <v-card-actions>
      <v-btn clearable @click="searchLocation">
        Search
      </v-btn>
      <v-btn v-if="location.display_name.length > 0" @click="addToDb">
        ADD TO DB
      </v-btn>
      <v-btn @click="calculateMatrix(52.24303985, 21.26271994765838, location.lat, location.lon)">
        CALCULATE
      </v-btn>
    </v-card-actions>
  </v-card>
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
      errorMsg: '',
      info: '',
      distance: 0.0,
      tmp: null
    }
  },

  // mounted() {

  // },

  methods: {
    calculateMatrix (lat1, lon1, lat2, lon2) {
      function deg2rad (deg) {
        return deg * (Math.PI / 180)
      }
      const R = 6371 // promień Ziemi w kilometrach
      const dLat = deg2rad(lat2 - lat1)
      const dLon = deg2rad(lon2 - lon1)
      const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // odległość w kilometrach
      this.tmp = distance.toFixed(2)

      // console.log(b)
      // const options = {
      //   method: 'GET',
      //   url: 'https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix',
      //   params: {
      //     origins: a,
      //     destinations: b
      //   },
      //   headers: {
      //     'X-RapidAPI-Key': process.env.NUXT_ENV_RAPIDAPI_KEY,
      //     'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com'
      //   }
      // }

    // const response = await this.$axios.request(options).then(function (response) {
    //   console.log(response.data)
    //   return response.data
    // }).catch(function (error) {
    //   console.error(error)
    // })
    // setTimeout(() => {
    //   this.tmp = (response.distances[0][0] / 1000 * 1.609344)
    // }, 50)
    },
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
        setTimeout(() => {
          this.errorMsg = ''
        }, 3000)
      }
    },
    async addToDb () {
      const body = {
        displayName: this.location.display_name,
        lat: this.location.lat,
        lon: this.location.lon
      }
      try {
        const response = await this.$axios.post('api/addLocation', body)
        // eslint-disable-next-line no-console
        console.log('res: ', response)
        if (response.data.name === 'error') {
          this.errorMsg = response.data.detail
          setTimeout(() => {
            this.errorMsg = ''
          }, 3000)
        } else {
          this.info = 'Dodano'
          setTimeout(() => {
            this.info = ''
          }, 3000)
        }
      } catch (err) {
        this.errorMsg = err
        setTimeout(() => {
          this.errorMsg = ''
        }, 3000)
        // eslint-disable-next-line no-console
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
