<template>
  <v-dialog
    v-model="showIn"
  >
    <v-card>
      <v-card-title>
        Dodaj komentarz do zlecenia id: {{ fault.id }}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="comment" />
        <v-btn @click="insertComment">
          Dodaj komentarz
        </v-btn>
        <v-timeline v-for="(com, id) in comments" :key="id" dense>
          <v-timeline-item>
            <i>{{ com.login }}</i> - {{ com.value }}
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ServiceManagerAddCommentModal',
  props: {
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      showIn: false,
      fault: {},
      comment: '',
      comments: []
    }
  },
  watch: {
    show () {
      this.showIn = !this.showIn
    },
    fault () {
      this.getData()
    }
  },
  async mounted () {
    await this.getData()
  },

  methods: {
    async getData () {
      console.log(this.fault)
      const body = {
        faultId: this.fault.id
      }
      const comments = await this.$axios.post('api/getComments', body)
      this.comments = comments.data.rows
      console.log(body, comments)
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
        this.comment = ''
        this.getData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
