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
              :show-current="dateFrom.toISOString().slice(0, 10)"
              :min="dateFrom.toISOString().slice(0, 10)"
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
      <v-card-text>
        <v-row>
          <v-list v-for="time in timeTable" :key="time.id">
            <v-list-item>
              <v-btn
                v-if="freeSlot.includes(time.id)"
                color="primary"
                @click="saveSelectedSlot(time)"
              >
                {{ time.start }} - {{ time.end }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-title>Dnia {{ picker }} - {{ msg }}</v-card-title>
    </v-card>
    <v-card v-if="selectedSlot">
      <v-card-title>Wybrany slot czasowy:   <b> {{ selectedSlot }}</b></v-card-title>
      <v-card-actions>
        <v-btn color="secondary" @click="createFault">
          Zarezerwój termin serwisu
        </v-btn>
      </v-card-actions>
      <v-alert
        v-if="resultMsg"
        type="success"
        elevarion="24"
      >
        {{ resultMsg.message }}
      </v-alert>
      <v-list>
        <v-list-item v-for="(f, index) in slotResponse.firms" :key="f.id" style="min-height: 0;">
          <div v-if="index === 0">
            Najbliższa wybrana firma:<br>
            <b>{{ f.firm.name }}
              -
              {{ f.matrix }} km</b><br>
            Pozostałe firmy:
          </div>
          <div v-if="index > 0 && index <= 5" style="margin-bottom: 0;">
            {{ f.firm.name }}
            -
            {{ f.matrix }} km
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>

const today = new Date()
const dateTo = new Date(today)
const dateFrom = new Date(today)
dateFrom.setDate(today.getDate() + 1)
dateTo.setDate(today.getDate() + 28)

export default {
  name: 'ServiceManagerRequestForm',
  data: () => ({
    selectedSlot: null,
    dateFrom,
    dateTo,
    picker: dateFrom.toISOString().substr(0, 10), // (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    valid: false,
    description: 'slotResponse',
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
    timeSlots: [],
    timeSlotsNvp: [],
    timeTable: [{ id: 1, start: 7, end: 9 }, { id: 2, start: 9, end: 11 }, { id: 3, start: 11, end: 13 }, { id: 4, start: 13, end: 15 }, { id: 5, start: 15, end: 17 }, { id: 6, start: 17, end: 19 }, { id: 7, start: 19, end: 21 }], // { id: 8, start: 20, end: 22 }], { id: 9, start: 16, end: 17 }, { id: 10, start: 17, end: 18 }, { id: 11, start: 18, end: 19 }, { id: 12, start: 19, end: 20 }, { id: 13, start: 20, end: 21 }],
    faultTypes: [],
    selectedType: [],
    faultTypesNvp: [],
    slotResponse: null,
    selectedSlotResponse: null,
    freeSlot: [],
    msg: null,
    resultMsg: null
  }),
  mounted () {
    this.getDictionaries()
  },
  methods: {
    saveSelectedSlot (val) {
      this.selectedSlot = val.start + '-' + val.end
    },
    async getDictionaries () {
      const response = await this.$axios.get('api/getTypeDict')
      const res = response.data.rows
      res.forEach((el) => {
        this.faultTypesNvp.push(el)
        this.faultTypes.push(el.name)
      })
      const response2 = await this.$axios.get('api/getSlotHour')
      response2.data.rows.forEach((el) => {
        this.timeSlotsNvp.push(el)
        this.timeSlots.push(el.value)
      })
      console.log('res: ', response2)
      console.log('TS : ', this.timeSlots)
    },
    async send () { // qualification handling on api
      if (this.$refs.form.validate()) {
        const nvp = this.faultTypesNvp
        const type = nvp.filter(nvp => nvp.name === this.selectedType)
        // eslint-disable-next-line no-console
        // console.log(type[0])
        const slot1 = this.timeSlots.indexOf(this.timeSlot_1) + 1
        // const slot2 = this.timeSlots.indexOf(this.timeSlot_2) + 1
        const body = {
          clientLocation: this.$store.state.customer.customer.coordinates,
          city: this.$store.state.customer.customer.city,
          typeId: type[0].id,
          date: this.picker,
          timeSlot_1: slot1
          // timeSlot_2: slot2
        }
        const response = await this.$axios.post('api/findSlot', body)
        console.log('find slot response', response)
        this.slotResponse = response.data
        this.selectedSlotResponse = response.data.availableTechnicians[0]
        this.freeSlot = []
        const arr = [1, 2, 3, 4, 5, 6, 7]
        try {
          this.freeSlot = arr.filter(el =>
            !response.data.availableTechnicians[0].reserved.includes(el)
          )
          console.log('wolne sloty: ', this.freeSlot)
        } catch (err) {
          console.warn('No slots data: ', err)
          this.msg = response.data.message
        }
      }
    },
    async createFault () {
      let faultTypeId = 0
      // eslint-disable-next-line prefer-const
      let slotHourId = 0
      this.faultTypesNvp.forEach((el) => {
        if (el.name === this.selectedType) {
          faultTypeId = el.id
        }
      })
      this.timeSlotsNvp.forEach((el) => {
        if (el.value === this.selectedSlot) {
          slotHourId = el.id
        }
      })
      const body = {
        customerId: this.$store.state.customer.customer.id,
        description: this.description,
        faultTypeId,
        timeSlotId: this.selectedSlotResponse.slotid,
        slotHourId
      }
      const response = await this.$axios.post('api/createFault', body)
      this.resultMsg = response.data
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
