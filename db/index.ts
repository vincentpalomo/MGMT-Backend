import { client } from './client'
const models = require('./models')

module.exports = {
  client,
  ...models,
}