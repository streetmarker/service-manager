<template>
  <div>
    <v-card>
      <v-card-title>
        Ankieta Usterkowa
        <v-col>
          <v-textarea
            :value="$store.state.customer.customer.display_name"
            label="Adres"
            outlined
            readonly
          />
        </v-col>
      </v-card-title>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-col>
          <v-select
            v-model="selectedType"
            label="Rodzaj usterki"
            :items="faultTypes"
            :rules="ruleType"
            required
          />
          <v-text-field
            v-model="description"
            :rules="descriptionRule"
            label="Opis Usterki"
            required
          />
          <v-row
            style="padding: 10px;"
          >
            <v-date-picker
              v-model="picker"
              color="info"
              :max="dateTo.toISOString().slice(0,10)"
              elevation="15"
            />
            <!-- :min="today.toISOString().slice(0,10)" -->
            <v-spacer />
            <v-alert type="info" style="height: fit-content;">
              Dostępne zaplanowanie na maksymalnie kolejne 4 tygydnie
            </v-alert>
          </v-row>
          <v-select
            v-model="timeSlot_1"
            label="Preferowany slot czasowy"
            :items="timeSlots"
            :rules="rule"
            required
          />
          <v-select
            v-model="timeSlot_2"
            label="Alternatywny slot czasowy"
            :items="timeSlots"
          />
        </v-col>
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
    </v-card>
    <v-card v-if="freeSlot.length > 0">
      <v-card-title>
        Wolne sloty czasowe {{ picker }}
      </v-card-title>
      <v-row>
        <v-list v-for="time in timeTable" :key="time.id">
          <v-list-item>
            <v-btn v-if="freeSlot.includes(time.id)" color="primary">
              {{ time.start }} - {{ time.end }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-row>
    </v-card>
    <v-card v-else>
      <v-card-title>Dnia {{ picker }} - {{ test }}</v-card-title>
    </v-card>
  </div>
</template>

<script>

const today = new Date()
const dateTo = new Date(today)
dateTo.setDate(today.getDate() + 28)

export default {
  name: 'ServiceManagerRequestForm',
  data: () => ({
    today,
    dateTo,
    picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    valid: false,
    description: 'test',
    descriptionRule: [
      v => !!v || 'description is required',
      v => (v && v.length <= 500) || 'description must be less than 500 characters'
    ],
    rule: [
      v => !!v || 'required'
    ],
    ruleType: [
      v => !!v || 'required',
      v => v.length > 0 || 'required'
    ],
    select: null,
    checkbox: false,
    timeSlot_1: '',
    timeSlot_2: '',
    timeSlots: ['7-9', '9-11', '11-13', '13-15', '15-17', '17-19', '19-21'], // do ogarnięcia tu i main grid po 2 h sloty
    timeTable: [{ id: 1, start: 7, end: 9 }, { id: 2, start: 9, end: 11 }, { id: 3, start: 11, end: 13 }, { id: 4, start: 13, end: 15 }, { id: 5, start: 15, end: 17 }, { id: 6, start: 17, end: 19 }, { id: 7, start: 19, end: 21 }], // { id: 8, start: 20, end: 22 }], { id: 9, start: 16, end: 17 }, { id: 10, start: 17, end: 18 }, { id: 11, start: 18, end: 19 }, { id: 12, start: 19, end: 20 }, { id: 13, start: 20, end: 21 }],
    faultTypes: [],
    selectedType: [],
    faultTypesNvp: [],
    test: null,
    freeSlot: []
  }),
  mounted () {
    this.getDictionaries()
  },
  methods: {
    parseResponse () {

    },
    async getDictionaries () {
      const response = await this.$axios.get('api/getTypeDict')
      const res = response.data.rows
      res.forEach((el) => {
        this.faultTypesNvp.push(el)
        // this.selectedType.push(el.id)
        this.faultTypes.push(el.name)
      })
      // this.faultTypes = response.data.rows
    },
    async send () {
      if (this.$refs.form.validate()) {
        const nvp = this.faultTypesNvp
        const type = nvp.filter(nvp => nvp.name === this.selectedType)
        // eslint-disable-next-line no-console
        // console.log(type[0])
        // const slot1 = this.timeSlots.indexOf(this.timeSlot_1) + 1
        // const slot2 = this.timeSlots.indexOf(this.timeSlot_2) + 1
        const body = {
          // clientId: this.$store.state.customer.customer.id, // dopiero przy rezerwacji
          clientLocation: this.$store.state.customer.customer.coordinates,
          city: this.$store.state.customer.customer.city,
          // description: this  .description,
          typeId: type[0].id,
          date: this.picker
          // timeSlot_1: slot1, // obsługa na razie na froncie
          // timeSlot_2: slot2
        }
        const response = await this.$axios.post('api/findSlot', body)
        this.test = null
        this.test = response
        this.freeSlot = []
        const arr = [0, 1, 2, 3, 4, 5, 6]
        try {
          this.freeSlot = arr.filter(el =>
            !response.data[0].reserved.includes(el)
          )
          console.log('wolne sloty: ', this.freeSlot)
        } catch (err) {
          console.error(err)
          this.test = response.data.message
        }
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
