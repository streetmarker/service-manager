<template>
  <v-dialog
    v-model="showIn"
  >
    <v-card>
      <v-card-title>
        Modyfikacja zlecenia
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-card>
              <v-card-title>
                Dane klienta
              </v-card-title>
              <v-card-text>
                <div>
                  <strong>Full Name:</strong> {{ fault.full_name }}
                </div>
                <div>
                  <strong>Phone:</strong> {{ fault.phone }}
                </div>
                <div>
                  <strong>Address:</strong> {{ fault.display_name }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card>
              <v-card-title>
                Dane zlecenia
              </v-card-title>
              <v-card-text>
                <div>
                  <strong>ID:</strong> {{ fault.id }}
                </div>
                <div>
                  <strong>Date:</strong> <v-text-field v-model="fault.date" />
                </div>
                <div>
                  <strong>Description:</strong> <v-text-field v-model="fault.description" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                Dane techniczne
              </v-card-title>
              <v-card-text>
                <div>
                  <strong>Service Man:</strong> {{ fault.serviceman_id }}
                </div>
                <div>
                  <strong>Subcontractor:</strong> {{ fault.subcontractor_id }}
                </div>
                <div>
                  <strong>Fault Type:</strong> {{ fault.faulttype_id }}
                </div>
                <div>
                  <strong>Fault Status:</strong> {{ fault.faultstatus_id || 'N/A' }}
                </div>
                <div>
                  <strong>Time Slot:</strong> {{ fault.timeslot_id }}
                </div>
                <div>
                  <strong>Slot Hour:</strong> {{ fault.slothour_id }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ServiceManagerModifyService',
  props: {
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      showIn: false,
      fault: {}
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

  }
}
</script>

<style lang="scss" scoped>

</style>
