<template>
  <v-app>
    <!-- <v-app-bar app>
      <v-toolbar-title>Panel serwisanta</v-toolbar-title>
      <v-spacer />
      {{ $store.state.user.user.login }}
    </v-app-bar> -->
    <!-- <v-main> -->
    <v-container>
      <v-layout row>
        <v-flex xs12 sm6>
          <v-card max-width="500">
            <v-card-title>Informacje o kliencie</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>ID</v-list-item-title>
                    <v-list-item-subtitle>{{ fault.id }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Data realizacji</v-list-item-title>
                    <v-list-item-subtitle>{{ fault.date }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Opis</v-list-item-title>
                    <v-list-item-subtitle>{{ fault.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Typ usterki</v-list-item-title>
                    <v-list-item-subtitle>{{ fault.faulttype_id }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Godzina</v-list-item-title>
                    <v-list-item-subtitle>{{ hour }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6>
          <v-card max-width="500">
            <v-card-title>Dane kontaktowe</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Imię i nazwisko</v-list-item-title>
                    <v-list-item-subtitle>{{ fault.full_name }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Telefon</v-list-item-title>
                    <v-list-item-subtitle>{{ fault.phone }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="showAddress = !showAddress">
                  <v-list-item-content>
                    <v-list-item-title>Adres</v-list-item-title>
                    {{ fault.display_name }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
          <v-timeline v-for="(com, id) in comments" :key="id" dense>
            <v-timeline-item>
              <i>{{ com.login }}</i> - {{ com.value }}
            </v-timeline-item>
          </v-timeline>
        </v-flex>
      </v-layout>
    </v-container>
    <v-text-field v-model="comment" label="Dodaj komentarz" />
    <v-select
      v-model="selectedStatus"
      :items="statusNames"
      label="Zmień status"
    />
    <v-row>
      <v-col>
        <v-btn
          color="warning"
          @click="reset"
        >
          Zresetuj zmiany
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color="success"
          @click="saveData"
        >
          Zapisz zmiany
        </v-btn>
      </v-col>
    </v-row>
    <!-- </v-main> -->
  </v-app>
</template>

<script>

export default {
  name: 'ServiceManagerId',

  data () {
    return {
      fault: {},
      selectedStatus: '',
      comment: '',
      comments: [],
      statusNames: [],
      statusNvp: [],
      showAddress: false,
      hour: '',
      timeSlotsNvp: [],
      timeSlots: []
    }
  },

  async mounted () {
    await this.getDictionaries()
    await this.getFault()
    // console.log('timeslots', this.timeSlots)
    // console.log('slothourid', this.fault.slothour_id)
    const hour = this.timeSlots[this.fault.slothour_id - 1]// .indexOf(this.fault.slothour_id)
    this.hour = hour
  },

  methods: {
    async saveData () {
      try {
        this.insertComment() // tmp
      } catch (error) {
        console.log(error)
      }
      if (this.selectedStatus.length > 0) {
        const status = this.statusNvp.filter(el => el.name === this.selectedStatus)
        console.log('status obj', status)
        const body = {
          statusId: status[0].id,
          faultId: this.fault.id
        }
        console.log('body status: ', body)
        try {
          const request = await this.$axios.post('api/updateFaultStatus', body)
          console.log(request)
        } catch (er) {
          console.error(er)
        }
      }
      await this.getDictionaries()
      await this.getFault()
    },
    async getDictionaries () {
      const request = await this.$axios.get('api/getFaultStatus')
      const res = request.data.rows
      this.statusNvp = res
      res.forEach((el) => {
        this.statusNames.push(el.name)
      })
      const response2 = await this.$axios.get('api/getSlotHour')
      response2.data.rows.forEach((el) => {
        this.timeSlotsNvp.push(el)
        this.timeSlots.push(el.value)
      })
    },
    async getFault () {
      const body = {
        faultId: this.$route.params.id
      }
      const response = await this.$axios.post('api/getFault', body)
      const fault = response.data.rows[0]
      const comments = await this.$axios.post('api/getComments', body)
      this.comments = comments.data.rows
      this.fault = fault
    },
    async insertComment () {
      if (this.comment.length > 0) {
        const body = {
          login: this.$store.state.user.user.login,
          value: this.comment,
          faultId: this.fault.id
        }
        console.log('comment body', body)
        const response = await this.$axios.post('api/insertComment', body)
        console.log(response)
      }
    },
    reset () {
      this.selectedStatus = ''
      this.comment = ''
    },
    formatDate (date) {
      const d = new Date(date)
      return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
    }
  }
}
</script>

<style scoped>
.subtitle-wrap {
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
