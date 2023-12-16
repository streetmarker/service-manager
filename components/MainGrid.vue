<!-- eslint-disable vue/no-lone-template -->
<template>
  <div>
    <v-card>
      <!-- firms select -->
      <!-- color="indigo darken-3" -->
      <v-banner
        color="secondary"
        rounded
      >
        <v-card-title>
          Grafik Slotów
          <v-select
            v-model="firm"
            style="max-width:30%; padding-left: 10%"
            label="Wybierz firmę"
            :items="firms"
          />
          <v-menu
            ref="menu"
            v-model="menu"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="dateSelect"
                label="Stan slotów na dzień"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                required
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="dateSelect"
              no-title
            />
          </v-menu>
        </v-card-title>
      </v-banner>
      <br>
      <br>
      <template>
        <div>
          <v-row
            justify="center"
            align="center"
          />
          <v-container
            id="scroll-target"
            style="max-height: 350px; padding-top: 20px"
            class="overflow-y-auto"
          >
            <v-row
              v-scroll:#scroll-target="onScroll"
              align="center"
              justify="center"
            />
            <div>
              <v-list v-for="timeSlot in timeSlots" :key="timeSlot.id">
                <v-list-item v-if="new Date(timeSlot.date).toISOString().slice(0,10) == dateSelect" style="border: 1px solid #ccc; border-radius: 4px; padding: 4px;">
                  <v-row>
                    <v-col max-width="10%" class="name">
                      {{ timeSlot.username }}
                    </v-col>
                    <v-col v-for="time in timeTable" :key="time.id">
                      <div v-if="!timeSlot.reserved.includes(time.id)">
                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                            >
                              {{ time.start }} -
                              {{ time.end }}
                            </v-btn>
                          </template>
                          <span>Id klienta:9875<br>
                            Id umowy:LLU12-M3</span>
                        </v-tooltip>
                      </div>
                      <div v-else>
                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              color="success"
                              v-bind="attrs"
                              v-on="on"
                            >
                              {{ time.start }} -
                              {{ time.end }}
                            </v-btn>
                          </template>
                          <span>Id klienta:9875<br>
                            Id umowy:LLU12-M3</span>
                        </v-tooltip>
                      </div>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </div>
          </v-container>
        </div>
      </template>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      firm: '',
      firms: [], // list firm from DB
      timeTable: [{ id: 1, start: 7, end: 9 }, { id: 2, start: 9, end: 11 }, { id: 3, start: 11, end: 13 }, { id: 4, start: 13, end: 15 }, { id: 5, start: 15, end: 17 }, { id: 6, start: 17, end: 19 }, { id: 7, start: 19, end: 21 }], // { id: 8, start: 20, end: 22 }], { id: 9, start: 16, end: 17 }, { id: 10, start: 17, end: 18 }, { id: 11, start: 18, end: 19 }, { id: 12, start: 19, end: 20 }, { id: 13, start: 20, end: 21 }],
      timeSlots: [],
      dateSelect: new Date().toISOString().substr(0, 10),
      menu: false,
      offsetTop: 0
    }
  },
  watch: {
    firm (newVal) {
      this.getSlots(newVal)
    },
    dateSelect () {
      this.getSlots(this.firm)
    }
  },
  mounted () {
    this.getFirms()
  },
  methods: {
    tmp () {
      console.log(this)
    },
    onScroll (e) {
      this.offsetTop = e.target.scrollTop
    },
    async getSlots (firm) {
      const body = {
        subContractor: firm,
        date: this.dateSelect
      }
      // console.log(body)
      const response = await this.$axios.post('api/getFirmSlots', body)
      this.timeSlots = response.data.rows
      // eslint-disable-next-line no-console
      console.log('timeSlots: ', this.timeSlots)
    },
    async getFirms () {
      const response = await this.$axios.get('api/getFirms')
      // console.log(response)
      const res = response.data.rows
      res.forEach((el) => {
        this.firms.push(el.name)
      })
    }
  }

}
</script>

  <style>
  .name {
    font-weight: bold;
  }

  .time-slot {
    position: relative;
    border: 1px solid black;
  }

  .time-slot-info {
    visibility: hidden;
  }
  .time-slot-info-reserved {
    visibility: visible;
  }
  .time-slot:hover .time-slot-info{
    visibility: visible;
  }
  </style>
