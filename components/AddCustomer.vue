<template>
  <v-card>
    <v-card-title>Dodawanie klienta do bazy danych</v-card-title>
    <v-card-text>
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
        <v-menu
          ref="menu1"
          v-model="menu1"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="contractStart"
              label="Data rozpoczęcia umowy"
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              required
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="contractStart"
            no-title
          />
        </v-menu>
        <v-menu
          ref="menu2"
          v-model="menu2"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="contractEnd"
              label="Data zakończenia umowy"
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              required
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="contractEnd"
            no-title
          />
        </v-menu>
        <v-alert type="info">
          Wyszukaj i wybierz lokalizację przed dodaniem
        </v-alert>
        <SearchLocation @location-added="handleLocationAdded" />
        <v-card-actions>
          <v-btn
            :disabled="!valid"
            color="info"
            class="mr-4"
            @click="send"
          >
            Zapisz klienta
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
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
          return (v === this.contractStart) || 'lol'
        }
      ],
      menu1: false,
      menu2: false,
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

  <style lang="scss" scoped />
</template>
