<template>
  <v-list>
    <v-list-item v-for="item in items" :key="item.id" @click="showDetails(item)">
      {{ item.name }}
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]
    }
  },
  methods: {
    showDetails (item) {
      // TODO: show details and options for selected item
    }
  }
}
</script>
