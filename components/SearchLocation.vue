<template>
  <v-card>
    <v-card-title>Wyszukaj adres</v-card-title>
    <v-card-text>
      <v-text-field v-model="searchText" clearable label="Adres" />
      <v-card-text v-if="!!location">
        {{ location.display_name }}
      </v-card-text>
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
      <v-btn v-if="!!location" color="primary" @click="addToDb">
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
      location: null,
      errorMsg: '',
      info: ''
    }
  },

  methods: {
    async searchLocation () {
      const body = {
        text: this.searchText
      }
      const response = await this.$axios.post('api/searchLocation', body)
      if (response) {
        this.location = response.data
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
