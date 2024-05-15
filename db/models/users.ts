// const { client } = require('../client')
import { client } from '../client'
const bcrypt = require('bcrypt')

// interface
interface User {
  username: string;
  password: string;
  avatar: string;
  userID: number;
}

// create users
const createUser = async ({ username, password, avatar}: User) => {
  try {
    const SALT_COUNT = 10
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

    const { rows: user } = await client.query(`
    INSERT INTO users(username, password, avatar)
    VALUES ($1, $2, $3)
    RETURNING id, username, avatar
    `, [username, hashedPassword, avatar])
    
    return user
  } catch (error) {
    console.error('error creating user DB', error)
  }
};

module.exports = {
  createUser,
}