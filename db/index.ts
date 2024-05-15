// import { client } from './client'
// export {}
const client = require('./client')
const models = require('./models')

module.exports = {
  client,
  ...models,
}