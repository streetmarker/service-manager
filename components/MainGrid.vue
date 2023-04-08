<template>
  <v-card colo>
    <!-- firmy select -->
    <v-card-title>
      <v-select
        v-model="firm"
        style="max-width:300px"
        label="Wybierz firmę"
        :items="firms"
      />
    </v-card-title>
    <v-list>
      <v-list-item v-for="timeSlot in timeSlots" :key="timeSlot.id">
        <v-row>
          <div class="name">
            {{ timeSlot.username }}
          </div>
          <v-col v-for="time in timeTable" :key="time.id">
            <div v-if="!timeSlot.reserved.includes(time.id)">
              <v-btn>
                {{ time.start }} -
                {{ time.end }}
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                color="success"
              >
                {{ time.start }} -
                {{ time.end }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      // const today = new Date();

      // const year = today.getFullYear();
      // const month = String(today.getMonth() + 1).padStart(2, '0');
      // const day = String(today.getDate()).padStart(2, '0');

      // const formattedDate = `${year}-${month}-${day}`;
      firm: '',
      firms: ['Test Firm', 'HFC Test'], // list firm from DB
      timeTable: [{ id: 1, start: 8, end: 9 }, { id: 2, start: 9, end: 10 }, { id: 3, start: 10, end: 11 }, { id: 4, start: 11, end: 12 }, { id: 5, start: 12, end: 13 }, { id: 6, start: 13, end: 14 }, { id: 7, start: 14, end: 15 }, { id: 8, start: 15, end: 16 }, { id: 9, start: 16, end: 17 }, { id: 10, start: 17, end: 18 }, { id: 11, start: 18, end: 19 }, { id: 12, start: 19, end: 20 }, { id: 13, start: 20, end: 21 }],
      timeSlots: []
    }
  },
  watch: {
    firm (newVal) {
      this.getSlots(newVal)
    }
  },
  methods: {
    async getSlots (firm) {
      const body = {
        subContractor: firm
      }
      const response = await this.$axios.post('api/getFirmSlots', body)
      this.timeSlots = response.data.rows
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
