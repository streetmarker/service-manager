import colors from 'vuetify/es5/util/colors'

export default {
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  // router: { // dynamic routing
  //   extendRoutes (routes, resolve) {
  //     routes.push({
  //       name: 'faults-details',
  //       path: '/pages/faults',
  //       component: resolve(__dirname, '/pages/faults')
  //     })
  //   }
  // },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - service-manager',
    title: 'service-manager',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    modules: ['vue-browser-update/nuxt',
      'vue-notification/nuxt', '@nuxtjs/tailwindcss', '@tailvue/nuxt'], // notify
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/notification.js', mode: 'client' }
    // { src: '~/plugins/firebase.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/router'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'Service-manager',
      short_name: 'SM',
      display: 'standalone',
      lang: 'en'
    },
    icon: {
      purpose: 'any'
    },
    workbox: {
      // swURL: 'custom-sw.js'
      importScripts: [
        'custom-sw.js'
      ]
    }
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.blue.darken4,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.indigo.lighten1,
          accent: colors.grey.darken4,
          secondary: colors.grey.lighten2,
          info: colors.blue.darken4,
          warning: colors.orange.darken3,
          error: colors.red.darken3,
          success: colors.green.darken3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  serverMiddleware: {
    '/server': '~/server/server.js'
  }
}
