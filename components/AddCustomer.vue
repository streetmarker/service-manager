<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="fullName"
        :rules="rule"
        label="Imię i Nazwisko"
        required
      />
      <v-text-field
        v-model="phone"
        :rules="rule"
        label="Numer telefonu"
        required
      />
      <v-text-field
        v-model="email"
        :rules="rule"
        label="Email"
        required
      />
      <v-text-field
        v-model="city"
        :rules="rule"
        label="Miasto"
        required
      />
      <v-date-picker
        v-model="contractStart"
        color="info"
        elevation="15"
      />
      <v-date-picker
        v-model="contractEnd"
        :rules="dateRule"
        color="info"
        elevation="15"
      />
      {{ contractStart }}
      {{ contractEnd }}
      <SearchLocation @location-added="handleLocationAdded" />
      <v-alert type="info">Wyszukaj i wybierz lokalizację przed dodaniem</v-alert>
      <v-card-actions>
        <v-btn
          :disabled="!valid"
          color="info"
          class="mr-4"
          @click="send"
        >
          Szukaj
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import SearchLocation from './SearchLocation.vue'

export default {
  name: 'ServiceManagerAddCustomer',
  components: { SearchLocation },
  data () {
    return {
      fullName: '',
      phone: '',
      email: '',
      city: '',
      contractStart: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      contractEnd: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      valid: false,
      rule: [
        (v) => {
          return !!v || 'required'
        }
      ],
      dateRule: [
        (v) => {
          // eslint-disable-next-line eqeqeq
          return (v === this.contractStart) || 'lol'
        }
      ],
      locationId: null
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
          fullName: this.fullName,
          phone: this.phone,
          email: this.email,
          city: this.city,
          locationId: this.locationId,
          contractStart: this.contractStart,
          contractEnd: this.contractEnd
        }
        const response = await this.$axios.post('api/addCustomer', data)
        console.log('client add res: ', response)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
