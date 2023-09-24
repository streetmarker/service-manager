<template>
  <v-dialog
    v-model="showIn"
    persistent
  >
    <v-card>
      <v-card-title>Dodawanie podwykonawcy do bazy danych</v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="name"
            :rules="rule"
            label="Nazwa"
            required
          />
          <v-select
            v-model="city"
            :rules="rule"
            :items="cities"
            label="Miasto"
            required
          />
          <v-alert type="info">
            Wyszukaj i wybierz lokalizację przed dodaniem
          </v-alert>
          <SearchLocation @location-added="handleLocationAdded" />
          <v-card-actions>
            <v-btn
              :disabled="!valid"
              color="primary"
              class="mr-4"
              @click="send"
            >
              Zapisz dane
            </v-btn>
            <v-btn
              color="error"
              class="mr-4"
              @click="showIn = !showIn"
            >
              Zamknij okno
            </v-btn>
          </v-card-actions>
        </v-form>
        <v-alert v-if="msg.length > 0" type="info">
          {{ msg }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import SearchLocation from './SearchLocation.vue'

export default {
  name: 'ServiceManagerAddCustomer',
  components: { SearchLocation },
  props: {
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      msg: '',
      showIn: this.show,
      name: '',
      city: '',
      valid: true,
      rule: [
        (v) => {
          return !!v || 'required'
        }
      ],
      locationId: null,
      cities: ['Warszawa', 'Sulejówek']

    }
  },
  watch: {
    show () {
      this.showIn = !this.showIn
    }
  },
  mounted () {
  },
  methods: {
    handleLocationAdded (value) {
      this.locationId = value
    },
    async send () {
      if (this.$refs.form.validate() && !!this.locationId) {
        console.log('valid')
        const data = {
          name: this.name,
          city: this.city,
          locationId: this.locationId
        }
        try {
          const response = await this.$axios.post('api/addFirm', data)
          console.log('subcontractor add res: ', response)
          this.msg = 'Dodano'
        } catch (error) {
          this.msg = 'Operacja się nie udała, szczegóły błędu:\n' + error
        }
      }
    }
  }
}
</script>

    <style lang="scss" scoped />
  </template>
