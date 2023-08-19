<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <div>
    <v-btn @click="test">
      test
    </v-btn>
    <v-btn id="notifications">
      Permission
    </v-btn>
    <button
      type="button"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="createDocument"
    >
      Create Document
    </button>
    <button
      type="button"
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      @click="deleteDocument"
    >
      Delete Document
    </button>
    {{ notifications }}
    <div class="text-center ma-2">
      <v-snackbar
        v-model="snackbar"
      >
        {{ toast }}

        <template #action="{ attrs }">
          <v-btn
            color="pink"
            toast
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { Client, Account, Databases } from 'appwrite'
import api from '../server/api/appwriteApi'

const client = new Client()
client
  .setEndpoint('http://192.168.1.20/v1')
  .setProject('64c50654b8fd7b1702cb')

const account = new Account(client)
const database = new Databases(client, '64c50686d727c5253d77')

// account.createAnonymousSession().then(
//   (response) => {
//     console.log('INIT')
//     console.log(response)
//   },
//   (error) => {
//     console.log('INIT')
//     console.log(error)
//   }
// )

function randomNotification (msg) {
  // const randomItem = Math.floor(Math.random() * 3)
  console.log(msg)
  const notifTitle = msg.payload.message
  const notifBody = msg.timestamp
  const notifImg = '/favicon.ico'
  const options = {
    body: notifBody,
    icon: notifImg
  }
  // eslint-disable-next-line no-new
  new Notification(notifTitle, options)
  // setTimeout(randomNotification, 30000)
}
export default {
  data () {
    return {
      message: 'Welcome!',
      notifications: [],
      toast: '',
      snackbar: false,
      text: 'Hello, Im a snackbar'
    }
  },
  watch: {
    message: function (message) {
      this.$notify({
        group: 'appwrite-notifications',
        title: 'Notification Title',
        text: 'This is the notification content.'
      })
      randomNotification(message)
      this.toast = `This event was called at ${message.timestamp}`
      this.snackbar = true
      setTimeout(() => {
        this.snackbar = false
      }, 5000)
    }
  },
  mounted () {
    const button = document.getElementById('notifications')
    button.addEventListener('click', () => {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          randomNotification()
        }
      })
    })

    this.listDocuments()
    this.login()

    if (account.get !== null) {
      try {
        client.subscribe('documents', (response) => {
          this.listDocuments()
          // console.log(response)
          this.message = response // `This event was called at ${response.timestamp}`
        })
      } catch (error) {
        console.log(error, 'error')
      }
    }
  },
  methods: {
    test () {
      console.log(client)
      // client.notifications.create('64c6542e9393edd7b2ec', 'message').then(
      //   (response) => {
      //     console.log('Notification sent successfully:', response)
      //   },
      //   (error) => {
      //     console.error('Error sending notification:', error)
      //   }
      // )
    },
    async login () {
      await api.createSession('mjaron4@gmail.com', 'strazak532')
      const accountApi = await api.getAccount()
      console.log('account', accountApi)
    },
    async listDocuments () {
      try {
        this.notifications = []
        const response = await database.listDocuments(
          '64c50686d727c5253d77', '64c5068a261dcd3c3c53'
        )
        response.documents.map(document =>
          this.notifications.push({ id: document.$id, msg: document.message })
        )
        console.log(this.notifications)
      } catch (error) {
        console.log(error)
      }
    },
    async createDocument () {
      try {
        await database.createDocument(
          '64c50686d727c5253d77', '64c5068a261dcd3c3c53',
          'unique()',
          {
            message: 'Welcome!',
            content: 'test'
          }
        )
        // this.listDocuments();
      } catch (error) {
        console.log(error)
      }
    },
    async deleteDocument () {
      if (this.notifications.length > 0) {
        try {
          const documentID = this.notifications[this.notifications.length - 1].id
          await database.deleteDocument(
            '64c50686d727c5253d77', '64c5068a261dcd3c3c53',
            documentID
          )
          // this.listDocuments();
        } catch (error) {
          console.log(error)
        }
      } else {
        alert('database is empty')
      }
    }
  }
}
</script>

<style>
/* Styling for the toast container */
div[label="toast"] {
  /* Add your styles here */
  /* Example styles */
  color: white;
  padding: 12px;
  border-radius: 8px;
}

/* Styling for the close button */
div[label="toast"] button {
  /* Add your styles here */
  /* Example styles */
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  outline: none;
}

/* Hover effect for the close button */
div[label="toast"] button:hover {
  /* Add your styles here */
  /* Example styles */
  opacity: 0.8;
}

/* Styling for the toast message content */
div[label="toast"] .ml-3 {
  /* Add your styles here */
  /* Example styles */
  font-size: 14px;
  line-height: 1.4;
}

/* Styling for the progress bar (if you want to modify it) */
div[label="toast"] .absolute {
  /* Add your styles here */
  /* Example styles */
  background-color: lightblue;
  height: 4px;
  bottom: 0;
}

</style>
