export const Server = {
  endpoint: process.env.NUXT_ENV_ENDPOINT,
  project: process.env.NUXT_ENV_PROJECT,
  collectionID: process.env.NUXT_ENV_COLLECTION_ID,
  database: process.env.NUXT_ENV_DATABASE_ID.toString()
}
