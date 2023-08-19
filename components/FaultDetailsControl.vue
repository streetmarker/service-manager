<template>
  <v-dialog
    v-model="showIn"
  >
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Szczegóły zlecenia
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
                      <strong>Date:</strong> {{ fault.date }}
                    </div>
                    <div>
                      <strong>Description:</strong> {{ fault.description }}
                    </div>
                    <div>
                      <strong>Comments:</strong> {{ fault.comments || 'N/A' }}
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
          <v-card-actions>
            <v-btn
              color="primary"
              class="mr-4"
              @click="close()"
            >
              Zamknij okno
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script>

export default {
  name: 'ServiceManagerFaultDetailsControl',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    // fault: {
    //   type: Object
    // },
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      fault: {},
      faultTypes: [],
      selectedType: [],
      faultTypesNvp: [],
      msg: null,
      showIn: false,
      login: '',
      email: '',
      valid: true,
      rule: [
        (v) => {
          return !!v || 'required'
        }
      ],
      listRule: [
        (v) => {
          return v.length > 0 || 'required'
        }
      ]
    }
  },
  watch: {
    show () {
      this.showIn = !this.showIn
      console.log(this.showIn)
    }
    // showIn () {
    //   this.showIn = !this.showIn
    //   if (!this.showIn) {
    //     this.close()
    //   }
    // }
  },
  mounted () {
    this.getDictionaries()
  },
  methods: {
    close () {
      // this.showIn = !this.showIn
      this.$emit('open', false)
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
    send () {
      if (this.$refs.form.validate()) {
        //
      }
    }
  }
}
</script>

    <style lang="scss" scoped />
  </template>
