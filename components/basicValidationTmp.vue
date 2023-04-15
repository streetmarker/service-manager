<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
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
  </div>
</template>

<script>
export default {
  name: 'ServiceManagerAddClient',

  data () {
    return {
      valid: false

    }
  },

  mounted () {

  },

  methods: {
    send () {
      if (this.$refs.form.validate()) {
        //
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
