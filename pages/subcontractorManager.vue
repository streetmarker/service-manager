<!-- eslint-disable vue/v-slot-style -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <!-- <span class="text-h5">{{ formTitle }}</span> -->
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="editedItem.login"
                  label="Dessert name"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="Calories"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="Fat (g)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="Carbs (g)"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="Protein (g)"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete this item?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <!-- <v-col> -->
    <v-card>
      <v-card-title>
        <v-btn color="primary" @click="modal1 = !modal1">
          Dodaj podwykonawcę
        </v-btn>
        <v-spacer />

        <v-btn @click="getServiceman(firm)">
          odświerz
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-spacer />

        <div v-if="firm">
          <v-btn data-cy="addSvmBtn" color="primary" @click="modal2 = !modal2">
            Dodaj Serwisanta do firmy
          </v-btn>
        </div>
      </v-card-title>
    </v-card>
    <br>
    <!-- </v-col> -->
    <v-card>
      <v-card-text>
        <v-select
          v-model="firm"
          label="Wybór podwykonawcy"
          :items="firms"
          data-cy="firmSelect"
        />
      </v-card-text>
    </v-card>
    <br>
    <v-card v-if="serviceman.length>0">
      <v-card-title>Lokalizacja firmy</v-card-title>
      <v-card-text>
        {{ locationName }}
      </v-card-text>
    </v-card>
    <br>

    <v-data-table
      :headers="headers"
      :items="serviceman"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #no-data>
        <v-btn
          color="primary"
        >
          Wybierz wykonawcę powyżej
        </v-btn>
      </template>
    </v-data-table>
    <br>

    <AddSubcontractorControl :show="modal1" />
    <AddServicemanControl :show="modal2" :firm="firmData" />
  </div>
</template>

<script>
import AddServicemanControl from '~/components/AddServicemanControl.vue'
import AddSubcontractorControl from '~/components/AddSubcontractorControl.vue'

export default {
  name: 'ServiceManagerSubcontractorManager',
  components: { AddSubcontractorControl, AddServicemanControl },
  data () {
    return {
      firmData: {
        id: 0,
        name: ''
      },
      modal1: false,
      modal2: false,
      firm: null,
      firms: [],
      firmsNvp: [],
      serviceman: [],
      locationName: '',
      headers: [
        {
          text: 'Technician',
          align: 'start',
          sortable: false,
          value: 'login'
        },
        {
          text: 'Qualifications',
          align: 'start',
          sortable: false,
          value: 'qualifications'
        },
        {
          text: 'Email',
          align: 'start',
          sortable: false,
          value: 'email'
        },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      // dialogs
      editedItem: {},
      editedIndex: -1,
      dialog: false,
      dialogDelete: false
    }
  },
  watch: {
    firm (val) {
      this.getServiceman(val)
      console.log('firm Nvp: ', this.firmsNvp)
      const firmObj = this.firmsNvp.filter(nvp => nvp.name === this.firm)
      this.locationName = firmObj[0].display_name
      this.firmData.id = firmObj[0].id
      this.firmData.name = val
    },
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  mounted () {
    this.getFirms()
  },
  methods: {
    async getServiceman (firmId) {
      const body = {
        firmId
      }
      // console.log(firmId)
      const response = await this.$axios.post('api/getServiceman', body)
      try {
        // console.log(response)
        this.serviceman = response.data.rows
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    },
    async getFirms () {
      const response = await this.$axios.get('api/getFirms')
      // console.log(response)
      const res = response.data.rows
      res.forEach((el) => {
        this.firmsNvp.push(el)
        this.firms.push(el.name)
      })
    },
    // modals
    editItem (item) {
      // this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem (item) {
      // console.log(item)
      const body = {
        svmId: item.svmid
      }
      const response = await this.$axios.post('api/removeServiceman', body)
      console.log('delete svm: ', response)
      // this.editedIndex = this.desserts.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      // this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      // this.$nextTick(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem)
      //   this.editedIndex = -1
      // })
    },

    closeDelete () {
      this.dialogDelete = false
      // this.$nextTick(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem)
      //   this.editedIndex = -1
      // })
    },

    save () {
      // if (this.editedIndex > -1) {
      //   Object.assign(this.desserts[this.editedIndex], this.editedItem)
      // } else {
      //   this.desserts.push(this.editedItem)
      // }
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
