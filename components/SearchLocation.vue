<template>
  <v-card>
    <v-card-title>Wyszukaj adres</v-card-title>
    <v-card-text>
      <v-text-field v-model="searchText" clearable label="Adres" />
      {{ location.display_name }} <br>
      <v-alert v-if="errorMsg.length > 0" type="error">
        {{ errorMsg }}
      </v-alert>
      <v-alert v-if="info.length > 0" type="success">
        {{ info }}
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-btn color="secondary" clearable @click="searchLocation">
        Szukaj
      </v-btn>
      <v-btn v-if="location.display_name.length > 0" color="primary" @click="addToDb">
        Wybierz
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
      info: ''
    }
  },

  methods: {
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
    },
    async addToDb () {
      const body = {
        displayName: this.location.display_name,
        lat: this.location.lat,
        lon: this.location.lon
      }
      try {
        const response = await this.$axios.post('api/addLocation', body)
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
