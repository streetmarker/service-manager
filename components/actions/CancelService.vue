<template>
  <v-dialog
    v-model="showIn"
  >
    <v-card>
      <v-card-title>
        Anulowanie zlecenia
      </v-card-title>
      <v-card-text>
        <v-text-field />
        {{ fault }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ServiceManagerCancelService',
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
