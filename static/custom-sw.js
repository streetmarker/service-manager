console.log('custom sw')

self.addEventListener('fetch', (event) => {
  console.log('Service worker intercepting fetch requests!')
  event.respondWith(fetch(event.request))
})

self.addEventListener('push', (event) => {
  console.log('Push notification received!')
  // You can handle the push event here if needed
})
