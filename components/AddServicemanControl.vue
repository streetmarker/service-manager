<template>
  <v-dialog
    v-model="showIn"
    persistent
  >
    <v-card>
      <v-card-title>Dodawanie technika do firmy {{ firm.name }}</v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="login"
            :rules="rule"
            label="Nazwa domenowa (format imie.nazwisko)"
            required
            data-cy="svmLogin"
          />
          <v-text-field
            v-model="email"
            :rules="rule"
            label="Email"
            required
            data-cy="svmEmail"
          />
          <v-row>
            <v-card-actions>
              <v-btn
                :disabled="!valid"
                color="primary"
                class="mr-4"
                data-cy="saveAddSvm"
                @click="send"
              >
                Zapisz dane
              </v-btn>
              <v-btn
                color="error"
                class="mr-4"
                data-cy="exitAddSvm"
                @click="showIn = !showIn"
              >
                Zamknij okno
              </v-btn>
            </v-card-actions>
            <v-select
              v-model="selectedType"
              :rules="listRule"
              :items="faultTypes"
              label="Kwalifikacje"
              multiple
              required
              data-cy="svmQalifications"
            />
          </v-row>
        </v-form>
        {{ msg }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'ServiceManagerAddCustomer',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    firm: {
      type: Object
    },
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      faultTypes: [],
      selectedType: [],
      faultTypesNvp: [],
      msg: null,
      showIn: this.show,
      login: '',
      email: '',
      roleId: 0,
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
    }
  },
  mounted () {
    this.getDictionaries()
    console.log(this.firm)
  },
  methods: {
    handleLocationAdded (value) {
      this.locationId = value
    },
    async getDictionaries () {
      const response = await this.$axios.get('api/getTypeDict')
      response.data.rows.forEach((el) => {
        this.faultTypesNvp.push(el)
        this.faultTypes.push(el.name)
      })
      const response2 = await this.$axios.get('api/getRoleDict')
      console.log('roles: ', response2)
      response2.data.rows.forEach((el) => {
        if (el.name === 'Serviceman') {
          this.roleId = el.id
        }
      })
    },
    async send () {
      if (this.$refs.form.validate()) {
        // console.log('valid')
        const faultIds = []
        console.log(this.faultTypesNvp)
        // console.log('----', this.selectedType)
        for (let i = 0; i < this.faultTypesNvp.length; i++) {
          for (let j = 0; j < this.selectedType.length; j++) {
            if (this.faultTypesNvp[i].name === this.selectedType[j]) {
              faultIds.push(this.faultTypesNvp[i].id)
              console.log(faultIds)
            }
          }
        }
        const data = {
          subcontractorId: this.firm.id,
          qualifications: faultIds,
          login: this.login,
          email: this.email,
          roleId: this.roleId
        }
        const response = await this.$axios.post('api/addServiceman', data) // merge
        console.log('serviceman add res: ', response)
        this.msg = response.status
      }
    }
  }
}
</script>

    <style lang="scss" scoped />
  </template>
