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
      <v-btn color="secondary" clearable @click="searchLocation">
        Szukaj
      </v-btn>
      <v-btn v-if="location.display_name.length > 0" color="primary" @click="addToDb">
        Wybierz
      </v-btn>
      <!-- <v-btn color="primary" @click="calculateMatrix(52.24303985, 21.26271994765838, location.lat, location.lon)">
        CALCULATE
      </v-btn> -->
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

  methods: {
    calculateMatrix (lat1, lon1, lat2, lon2) { // to DEL
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
    },
    async searchLocation () {
      const encodedQuery = encodeURIComponent(this.searchText)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$axios.get(`https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json`)
            .then(res => resolve(res))
            .catch(err => reject(err))
        }, 50)
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
      this.calculateMatrix(52.24303985, 21.26271994765838, this.location.lat, this.location.lon)
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
          const locationId = response.data.rows[0].id
          this.$emit('location-added', locationId) // emit to parent
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
