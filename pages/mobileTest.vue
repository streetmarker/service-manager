<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>My Mobile App</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-card>
          <v-card-title>
            Welcome!
          </v-card-title>
          <v-card-text>
            This is a sample mobile component using Vuetify 2.6.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="buttonClicked">
              Click me!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; 2023 My Mobile App</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  methods: {
    buttonClicked () {
      alert('Button clicked!')
    }
  }
}
</script>
